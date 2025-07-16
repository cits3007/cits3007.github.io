# Vagrantfile for the x86-64 environment
# Uses UTM as the provider with box: utm/bookworm (ensuring x86_64 emulation)
# Provisioning: Updates packages and installs build-essential and gcc.
# Resources: primary disk of 16GB. Uncomment lines after "config.vm.provider" to specify
#   8GB RAM, 6 CPU cores.
# Disk size set using the vagrant-disksize plugin.

Vagrant.configure("2") do |config|
  config.vm.box = "utm/bookworm"
  config.vm.box_architecture = "amd64"

  # Set primary disk size to 16GB
  config.disksize.size = "16GB"

  # Provisioning: update packages and install build tools
  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    sudo env DEBIAN_FRONTEND=noninteractive apt-get -y install build-essential
  SHELL

  # Set the hostname inside the VM to "x86-64"
  config.vm.hostname = "x86-64"

  # UTM provider settings for x86_64; ensure x86_64 emulation is enabled.
  config.vm.provider "utm" do |um|
    um.name = "x86_64"    # This sets the UTM VM name to "x86_64"
    # um.memory = 8192      # 8GB RAM
    # um.cpus   = 6         # 6 CPU cores
    # Optionally, specify architecture settings if supported, e.g.:
    # um.arch = "x86_64"
    # Additional UTM-specific settings can be added here
  end
end

