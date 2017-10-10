# -*- coding: utf-8 -*-
# from __future__ import unicode_literals, print_function  # python2
import requests
import json
import logging
import hashlib
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
import base64


class Login:

    def __init__(self, username, password):
        self.public_key = ""
        self.login_la = ""
        self.username = username
        self.password2 = password
        self.password = ""

    def get_public_key(self):
        url = "http://login.51talk.com/sso/publickey?client=1"
        try:
            r = requests.get(url)
            if r.status_code == 200:
                pub_key = json.loads(r.text.replace("try{(", "").replace(")}catch(e){};", ""))
                self.public_key = pub_key["res"]["rsa_pub"]
                self.password = self.encrypt(self.password2)
                return self.public_key
            else:
                logging.error('Could not get the public key')
                return None
        except requests.exceptions.HTTPError as exception:
            logging.error('Could not get the public key', exception)
            if is_debug_run():
                logging.exception('Could not get the public key', exception)
            return None
    def pre_login(self):
        url ="http://login.51talk.com/sso/prelogin?client=1&username=" + self.username + "&password2=" + self.password2 + "&password=" + self.password
        print(url)
        try:
            r = requests.get(url)
            if r.status_code == 200:
                pre_login_info = json.loads(r.text)
                self.login_la = pre_login_info["res"]["la"]
                return self.login_la
            else:
                logging.error('pre login error')
                return None
        except requests.exceptions.HTTPError as exception:
            logging.error('pre login error', exception)
            if is_debug_run():
                logging.exception('pre login error', exception)
            return None
    def login(self):
        data = {
            "from_url":"",
            "client" : 1,
            "autologin" : 1,
            "username" : self.username,
            "password" : self.password,
            "la" : self.login_la
        }
        url = "http://login.51talk.com/ajax/login"
        try:
            headers = {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8;User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'}
            r = requests.post(url, data=data, headers=headers)
            if r.status_code == 200:
                print(r.text)
        except requests.exceptions.HTTPError as exception:
            logging.error("login error",exception)
            if is_debug_run():
                logging.exception("login error", exception)
            return None

    def encrypt(self, msg):
        rsa = RSA.importKey(self.public_key)
        cipher = PKCS1_v1_5.new(rsa)
        ciphertext = cipher.encrypt(msg.encode('utf8'))
        return base64.b64encode(ciphertext).decode('ascii')


if __name__ == "__main__":
    login = Login("186xxxxxxx", "abc")
    # print(login.pre_login())
    login.get_public_key()
    login.pre_login()
    login.login()
#
