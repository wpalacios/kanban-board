import uuid
import graphene
from datetime import datetime
from database import get_dynamodb_table
from models import Card


class CardType(graphene.ObjectType):
    id = graphene.ID()
    title = graphene.String()
    description = graphene.String()
    card_status = graphene.String()
    created_at = graphene.DateTime()
    updated_at = graphene.DateTime()


class CreateCard(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        description = graphene.String()
        card_status = graphene.String()

    card = graphene.Field(CardType)

    def mutate(self, info, title, description, card_status):
        created_at = updated_at = datetime.utcnow()
        card = Card(id=str(uuid.uuid4()), title=title,
                    description=description, card_status=card_status, created_at=created_at, updated_at=updated_at)
        table = get_dynamodb_table()
        table.put_item(
            Item={
                'id': card.id,
                'title': card.title,
                'description': card.description,
                'card_status': card.card_status,
                'created_at': card.created_at.isoformat(),
                'updated_at': card.updated_at.isoformat()
            }
        )
        return CreateCard(card=card)


class UpdateCard(graphene.Mutation):
    class Arguments:
        id = graphene.ID()
        title = graphene.String()
        description = graphene.String()
        card_status = graphene.String()
        updated_at = graphene.DateTime()

    card = graphene.Field(CardType)

    def mutate(self, info, id, title, description, card_status):
        updated_at = datetime.utcnow()
        table = get_dynamodb_table()
        response = table.update_item(
            Key={'id': id},
            UpdateExpression='SET title = :title, description = :description, card_status = :card_status, updated_at = :updated_at',
            ExpressionAttributeValues={
                ':title': title,
                ':description': description,
                ':card_status': card_status,
                ':updated_at': updated_at.isoformat()
            },
            ReturnValues='ALL_NEW'
        )
        item = response.get('Attributes')
        if item:
            return UpdateCard(card=Card(item['id'], item['title'], item['description'], item['card_status'], format_datetime(item['created_at']), format_datetime(item['updated_at'])))
        return None


class DeleteCard(graphene.Mutation):
    class Arguments:
        id = graphene.ID()

    success = graphene.Boolean()

    def mutate(self, info, id):
        table = get_dynamodb_table()
        response = table.delete_item(Key={'id': id})
        if response.get('ResponseMetadata').get('HTTPStatusCode') == 200:
            return DeleteCard(success=True)
        return DeleteCard(success=False)


def format_datetime(datetime_str):
    format_string = "%Y-%m-%dT%H:%M:%S.%f"
    iso_datetime = datetime.strptime(datetime_str, format_string)
    return iso_datetime


class Query(graphene.ObjectType):
    card = graphene.Field(CardType, id=graphene.ID())
    cards = graphene.List(CardType, order_by=graphene.String())

    def resolve_card(self, info, id):
        table = get_dynamodb_table()
        response = table.get_item(Key={'id': id})
        item = response.get('Item')
        if item:
            created_at = format_datetime(item['created_at'])
            updated_at = format_datetime(item['updated_at'])
            return Card(item['id'], item['title'], item['description'], item['card_status'], created_at, updated_at)
        return None

    def resolve_cards(self, info, order_by=None, ascending=False):
        table = get_dynamodb_table()
        scan_kwargs = {}
        if order_by:
            scan_kwargs['IndexName'] = 'CreatedAtIndex'
            scan_kwargs['Select'] = 'ALL_ATTRIBUTES'

            response = table.scan(**scan_kwargs)
            items = response.get('Items', [])

            # Sort the items based on the specified field and order
            items.sort(key=lambda item: item.get(
                order_by), reverse=not ascending)

            cards = [
                Card(item['id'], item['title'], item['description'], item['card_status'],
                     format_datetime(item['created_at']), format_datetime(item['updated_at']))
                for item in items
            ]

            return cards
        response = table.scan(**scan_kwargs)
        items = response.get('Items', [])
        cards = [
            Card(item['id'], item['title'], item['description'], item['card_status'],
                 format_datetime(item['created_at']), format_datetime(item['updated_at']))
            for item in items
        ]
        return cards


class Mutation(graphene.ObjectType):
    create_card = CreateCard.Field()
    update_card = UpdateCard.Field()
    delete_card = DeleteCard.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
