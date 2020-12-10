"""
Client that sends the file (uploads)
"""
import send_data

filename = 'test.txt'
port = 5001
host = '192.168.1.66'
host = '127.0.0.1'

message = 'Hej där! Hur står det till idag? Bla bal balbalbalbalblalblablalblabl'

print(f'Sending string "{message}"')
send_data.send_string(message, host, port)
