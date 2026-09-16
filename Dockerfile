FROM alpine:latest
RUN apk update && apk add --no-cache openjdk17-jre-headless wget
WORKDIR /server
RUN wget -O BungeeCord.jar https://github.com
RUN mkdir plugins
RUN wget -O plugins/EaglerXBungee.jar https://github.com
EXPOSE 8080
CMD ["java", "-Xmx512M", "-jar", "BungeeCord.jar"]
