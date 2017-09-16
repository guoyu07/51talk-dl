# -*- coding: utf-8 -*-
import requests
import json
import logging

class Login:

    def __init__(self, username, password):
        self.public_key = ""
        self.login_la = ""
        self.username = username
        self.password = password

    def get_public_key(self):
        url = "http://login.51talk.com/sso/publickey?client=1"
        try:
            r = requests.get(url)
            if r.status_code == 200:
                pub_key = json.loads(r.text.replace("try{(", "").replace(")}catch(e){};", ""))
                self.public_key = pub_key["res"]["rsa_pub"]
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
        url ="http://login.51talk.com/sso/prelogin?client=1&username=" + self.username + "&password2=" + self.password
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

if __name__ == "__main__":
    login = Login("186", "xxx")
    print(login.pre_login())
    # print(login.get_public_key())

