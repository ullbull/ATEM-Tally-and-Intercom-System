CC = python
PROJECT_NAME = atem_tally_and_intercom_system
FILES_PI = client.py santa.jpg santa_detector.py
BASE_IP = 192.168.1.66
CLIENT_0_IP = 192.168.1.63
BASE_USERNAME = emart
CLIENT_0_USERNAME = ecutbildning
make:
	$(MAKE) copy_to_base
	$(MAKE) copy_to_client_0
	
copy_to_base:
	scp -r ./base_unit $(BASE_USERNAME)@$(BASE_IP):~/$(PROJECT_NAME)

copy_to_client_0:
	scp -r ./client $(CLIENT_0_USERNAME)@$(CLIENT_0_IP):~/$(PROJECT_NAME)

copy_all:
	scp -r ..//$(PROJECT_NAME) $(CLIENT_0_USERNAME)@$(CLIENT_0_IP):~
	scp -r ..//$(PROJECT_NAME) $(BASE_USERNAME)@$(BASE_IP):~

connect:
	ssh $(CLIENT_0_USERNAME)@$(CLIENT_0_IP) -t "cd $(PROJECT_NAME); bash --login"
