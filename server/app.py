import os
from flask import Flask
from graphql_server.flask import GraphQLView
from schema import schema
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Initialize CORS with default settings

app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True)
)
