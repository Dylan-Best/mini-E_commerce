# Utilise Nginx léger
FROM nginx:alpine

# Copier tout le frontend dans le container
COPY . /usr/share/nginx/html

# Copier le fichier de configuration Nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Commande par défaut (déjà fournie par l'image nginx)
CMD ["nginx", "-g", "daemon off;"]
