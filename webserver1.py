#!/usr/bin/python
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse
import time
from os.path import basename, join

#porta del webserver
PORT_NUMBER = 80
root = "D:\\Users\\capett0s\\Desktop\\bootstrap-4.0.0-alpha.6-dist"

#This class will handles any incoming request from the browser 
class myHandler(BaseHTTPRequestHandler):
	
    #Handler for the GET requests
    def do_GET(self):
        filepath = root+self.path
        in_file = open(filepath, "rb")
        data = in_file.read()
        in_file.close()
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(data)
        
try:
    #Create a web server and define the handler to manage the incoming request
    server = HTTPServer(('', PORT_NUMBER), myHandler)

    #Wait forever for incoming htto requests
    server.serve_forever()

except KeyboardInterrupt:
    print('^C received, shutting down the web server')
    server.socket.close()
