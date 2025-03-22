.PHONY: build-tetris run-tetris stop-tetris clean-tetris

PROJECT_DIR_TETRIS = tetris-game
# Construir la imagen de Docker
build-tetris:
	cd $(PROJECT_DIR_TETRIS) && docker-compose build

# Ejecutar el contenedor
run-tetris:
	cd $(PROJECT_DIR_TETRIS) && docker-compose up

# Detener el contenedor
stop-tetris:
	cd $(PROJECT_DIR_TETRIS) && docker-compose down

# Limpiar contenedores e imágenes
clean-tetris:
	cd $(PROJECT_DIR_TETRIS) && docker-compose down --rmi all --volumes

# Acceso a la terminal del contenedor
bash-tetris:
	cd $(PROJECT_DIR_TETRIS) && docker-compose exec tetris bash