FROM sonarqube:6.7.3

WORKDIR /opt/sonarqube/extensions/

RUN wget --no-check-certificate https://github.com/SonarSource/SonarJS/releases/download/2.14-RC1/sonar-javascript-plugin-2.14-build2420.jar

WORKDIR /opt/sonarqube
