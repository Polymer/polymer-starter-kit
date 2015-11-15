> Disclaimer:
This is how I achieved full PSK running on chromebook. Using light version is way easier and described in different guide. This most easy way I figured out, if you work in multiple node environments, you should definitely run node by nvm (not covered here).

Bad news first: you need to switch your Chromebook to dev mode and install crouton. Nice guide on that is [here] (https://github.com/dnschneid/crouton/blob/master/README.md).
Current LTS is quite old and I was afraid of issues with node and compiler, so I suggest to install at least "Precise Pangolin" with ```sudo sh ~/Downloads/crouton -r precise -t cli-extra```. Enter your new Ubuntu with ```sudo enter chroot```.
As I mentioned, running node on older distribution require some hackery, but amazing people from Nodesource simplified this to typing:
```
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y git
```
It is useful to have whole build essentials too, so go ahead and install 
```
sudo apt-get install -y build-essential
```
Now you are basically ready to follow PSK guide in [readme files] (https://github.com/PolymerElements/polymer-starter-kit/blob/master/README.md). Download PSK and extract it somewhere in Downloads directory:
> using Downloads directory is easiest way to edit files from your Chrome OS environment

```
cd Downloads
wget https://github.com/PolymerElements/polymer-starter-kit/releases/download/v1.1.1/polymer-starter-kit-1.1.1.zip
mkdir Develop
unzip polymer-starter-kit-1.1.1.zip -d Develop/
```
Then you will have to install global bower and gulp packages **under root**  
> we need to use root as a result of easy way to get node.js in Precise Pangolin

```
sudo npm install -g gulp bower
```
and follow rest of guide as described:

```
cd Develop/polymer-starter-kit-1.1.1
npm install && bower install
gulp serve
```
