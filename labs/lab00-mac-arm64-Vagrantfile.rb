# Vagrantfile for the ARM64 environment
# Uses UTM as the provider with box: utm/ubuntu-24.04
# Provisioning: Updates packages and installs build-essential and gcc.
# Resources: primary disk of 16GB. Uncomment lines after "config.vm.provider" to specify
#   8GB RAM, 6 CPU cores.
# Disk size set using the vagrant-disksize plugin.

Vagrant.configure("2") do |config|
  config.vm.box = "utm/ubuntu-24.04"

  # Set primary disk size to 16GB
  config.disksize.size = "16GB"

  # Provisioning: update packages and install build tools
  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    sudo env DEBIAN_FRONTEND=noninteractive apt-get -y install build-essential
  SHELL

  # Set the hostname inside the VM to "ARM64"
  config.vm.hostname = "ARM64"

  config.vm.provider "utm" do |um|
    um.name = "ARM64"    # This sets the UTM VM name to "ARM64"
    # um.memory = 8192     # 8GB RAM
    # um.cpus   = 6        # 6 CPU cores
    # Additional UTM-specific settings can be added here
  end
end
