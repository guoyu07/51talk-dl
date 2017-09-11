# -*- coding: utf-8 -*-

"""
Cookie handling module.
"""

import logging
import os
import ssl

import requests
from requests.adapters import HTTPAdapter

try:  # Workaround for broken Debian/Ubuntu packages? (See issue #331)
    from requests.packages.urllib3.poolmanager import PoolManager
except ImportError:
    from urllib3.poolmanager import PoolManager



class TLSAdapter(HTTPAdapter):
    """
    A customized HTTP Adapter which uses TLS v1.2 for encrypted
    connections.
    """
    def init_poolmanager(self, connections, maxsize, block=False):
        self.poolmanager = PoolManager(num_pools=connections,
                                       maxsize=maxsize,
                                       block=block,
                                       ssl_version=ssl.PROTOCOL_TLSv1)
