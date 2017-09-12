# -*- coding: utf-8 -*-
import requests
import json
import logging

class Login:
    def get_public_key(self, client_id):
        url = "http://login.51talk.com/sso/publickey?client=" + client_id
        try:
            r = requests.get(url)
            if r.status_code == 200:
                pub_key = json.loads(r.text.replace("try{(", "").replace(")}catch(e){};", ""))
                return pub_key["res"]["rsa_pub"]
            else:
                logging.error('Could not get the public key')
                return None
        except requests.exceptions.HTTPError as exception:
            logging.error('Could not get the public key', exception)
            if is_debug_run():
                logging.exception('Could not get the public key', exception)
            return None

if __name__ == "__main__":
    login = Login()
    # client id is 1 when the client is a website
    print(login.get_public_key("1"))

