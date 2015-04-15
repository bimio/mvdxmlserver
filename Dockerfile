FROM phusion/baseimage:0.9.16

CMD ["/sbin/my_init"]

RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN sudo apt-get install nodejs -y

WORKDIR /home/docker

EXPOSE 3001

ADD package.json /home/docker/package.json

RUN npm install

ADD . /home/docker

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*