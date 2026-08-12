#!/usr/bin/env bash
# Create RDS MySQL for University MIS (public demo config).
# Usage: ./infra/01-create-rds.sh
# Env overrides: AWS_REGION, DB_INSTANCE_ID, DB_NAME, MASTER_USER, MASTER_PASSWORD, VPC_ID, SUBNET_IDS

set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
DB_INSTANCE_ID="${DB_INSTANCE_ID:-university-mis-db}"
DB_NAME="${DB_NAME:-university_mis}"
MASTER_USER="${MASTER_USER:-misadmin}"
MASTER_PASSWORD="${MASTER_PASSWORD:-}"
SG_NAME="${SG_NAME:-mis-rds-sg}"

if [[ -z "$MASTER_PASSWORD" ]]; then
  MASTER_PASSWORD="$(openssl rand -base64 18 | tr -d '/+=' | cut -c1-20)Aa1"
  echo "==> Generated MASTER_PASSWORD (save this): $MASTER_PASSWORD"
fi

echo "==> Region: $AWS_REGION"

# Default VPC
VPC_ID="${VPC_ID:-$(aws ec2 describe-vpcs --region "$AWS_REGION" --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)}"
echo "==> VPC: $VPC_ID"

SG_ID=$(aws ec2 describe-security-groups --region "$AWS_REGION" \
  --filters Name=group-name,Values="$SG_NAME" Name=vpc-id,Values="$VPC_ID" \
  --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || true)

if [[ -z "$SG_ID" || "$SG_ID" == "None" ]]; then
  SG_ID=$(aws ec2 create-security-group --region "$AWS_REGION" \
    --group-name "$SG_NAME" \
    --description "University MIS RDS MySQL demo access" \
    --vpc-id "$VPC_ID" \
    --query GroupId --output text)
  aws ec2 authorize-security-group-ingress --region "$AWS_REGION" \
    --group-id "$SG_ID" \
    --protocol tcp --port 3306 --cidr 0.0.0.0/0
  echo "==> Created security group $SG_ID (3306 open for demo)"
else
  echo "==> Reusing security group $SG_ID"
fi

EXISTING=$(aws rds describe-db-instances --region "$AWS_REGION" \
  --db-instance-identifier "$DB_INSTANCE_ID" \
  --query 'DBInstances[0].DBInstanceStatus' --output text 2>/dev/null || echo "missing")

if [[ "$EXISTING" == "missing" || "$EXISTING" == "None" ]]; then
  echo "==> Creating RDS instance $DB_INSTANCE_ID (this takes 5–10 minutes)..."
  aws rds create-db-instance --region "$AWS_REGION" \
    --db-instance-identifier "$DB_INSTANCE_ID" \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --engine-version 8.0 \
    --master-username "$MASTER_USER" \
    --master-user-password "$MASTER_PASSWORD" \
    --allocated-storage 20 \
    --storage-type gp2 \
    --db-name "$DB_NAME" \
    --vpc-security-group-ids "$SG_ID" \
    --publicly-accessible \
    --backup-retention-period 1 \
    --no-multi-az \
    --tags Key=Project,Value=university-mis
else
  echo "==> RDS already exists (status=$EXISTING)"
fi

echo "==> Waiting for RDS available..."
aws rds wait db-instance-available --region "$AWS_REGION" --db-instance-identifier "$DB_INSTANCE_ID"

ENDPOINT=$(aws rds describe-db-instances --region "$AWS_REGION" \
  --db-instance-identifier "$DB_INSTANCE_ID" \
  --query 'DBInstances[0].Endpoint.Address' --output text)

mkdir -p infra/out
cat > infra/out/rds.env <<EOF
AWS_REGION=$AWS_REGION
DB_INSTANCE_ID=$DB_INSTANCE_ID
DB_NAME=$DB_NAME
DB_USER=$MASTER_USER
DB_PASSWORD=$MASTER_PASSWORD
DB_ENDPOINT=$ENDPOINT
DB_URL=jdbc:mysql://${ENDPOINT}:3306/${DB_NAME}?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC
RDS_SG_ID=$SG_ID
EOF

echo "==> Wrote infra/out/rds.env"
echo "    DB_ENDPOINT=$ENDPOINT"
echo "    DB_USER=$MASTER_USER"
echo "    DB_PASSWORD=$MASTER_PASSWORD"
