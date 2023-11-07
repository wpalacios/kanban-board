import uuid
from datetime import datetime
import boto3
from botocore.exceptions import NoCredentialsError


def create_dynamodb_table():
    dynamodb = boto3.resource(
        'dynamodb', endpoint_url='http://localhost:8000')

    table = dynamodb.create_table(
        TableName='Cards',
        KeySchema=[
            {
                'AttributeName': 'id',
                'KeyType': 'HASH'  # Partition_key
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'id',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'title',
                'AttributeType': 'S'
            }
        ],
        GlobalSecondaryIndexes=[
            {
                'IndexName': 'CreatedAtIndex',  # Index name
                'KeySchema': [
                    {
                        'AttributeName': 'id',
                        'KeyType': 'HASH'  # Partition_key
                    },
                    {
                        'AttributeName': 'title',
                        'KeyType': 'RANGE'  # Sort_key
                    },
                ],
                'Projection': {
                    'ProjectionType': 'ALL'  # You can adjust this based on your needs
                },
                'ProvisionedThroughput': {
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                },
            },
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    )

    print("Table status:", table.table_status)


def delete_dynamodb_table():
    try:
        dynamodb = boto3.client(
            'dynamodb', endpoint_url='http://localhost:8000')

        dynamodb.delete_table(TableName='Cards')

    except NoCredentialsError:
        print("No AWS credentials found. Running with DynamoDB Local.")


def get_dynamodb_table():
    try:
        dynamodb = boto3.resource(
            'dynamodb', endpoint_url='http://localhost:8000')

        table = dynamodb.Table("Cards")

        if not table:
            table = create_dynamodb_table()
        return table
    except NoCredentialsError:
        print("No AWS credentials found. Running with DynamoDB Local.")
