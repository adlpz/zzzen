#!/usr/bin/env python3
# Whoa, that's zzzen
#
# Only for python3.
#

import cgitb
cgitb.enable()

import web
import re
import uuid
import pymongo


class AbstractStorage(object):
    """Abstract resource database with REST interface"""

    def GET(self, endpoint):
        collection, resource, *_ = endpoint.split('/')

        if not collection:
            # Invalid request
            web.badrequest()
        if not resource:
            # Requesting a listing of some collection
            self.get_collection(collection)
        else:
            # Requesting an individual resource
            self.get_resource(collection, resource)

    def POST(self, endpoint):
        collection, resource, *_ = endpoint.split('/')

        if not collection:
            web.badrequest()
        if not resource:
            # Inserting into collection
            self.put_resource(collection, web.data())
        else:
            # Treating a resource as a collection
            web.badrequest()

    def PUT(self, endpoint):
        collection, resource, *_ = endpoint.split('/')

        if not collection:
            web.badrequest()
        if not resource:
            web.badrequest()
        else:
            self.replace_resource(collection, resource, web.data())

    def DELETE(self, endpoint):
        collection, resource, *_ = endpoint.split('/')

        if not collection:
            web.badrequest()
        if not resource:
            web.badrequest()
        else:
            self.drop_resource(collection, resource)

    def get_collection(self, collection):
        raise NotImplementedError

    def get_resource(self, collection, resource):
        raise NotImplementedError

    def put_resource(self, collection, data):
        raise NotImplementedError

    def replace_resource(self, collection, resource, data):
        raise NotImplementedError

    def drop_resource(self, collection, resource):
        raise NotImplementedError




class MongoStorage(AbstractStorage):
    def __init__(self, database):
        self.cn = pymongo.MongoClient()
        self.db = cn[database]
        self.collections = {
            'posts': db.posts
        }

    def __check_collection(self, fn):
        def d(*args):
            if args[1] not in self.collections.keys():
                return {'error': {'message': 'Collection doesn\'t exist'}}
            else:
                d(*args)
        return d

    @self.__check_collection
    def get_collection(self, collection):

        return (d for d in self.collections[collection].find())

    @self.__check_collection
    def get_resource(self, collection, resource):

        return self.collections[collection].find_one({'uuid': resource})

    @self.__check_collection
    def put_resource(self, collection, data):

        uuid = uuid.uuid4()
        data['uuid'] = uuid

        self.collections[collection].insert(data)

        return {'collection': collection, 'resource': uuid, 'status': 'inserted'}

    @self.__check_collection
    def replace_resource(self, collection, resource):

        self.collections[collection].update({"$set": data})

    @self.__check_collection
    def drop_resource(self, collection, resource):
        self.collections[collection].remove({'uuid': resource})
