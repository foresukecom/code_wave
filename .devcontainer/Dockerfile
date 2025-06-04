FROM ubuntu:latest

# Install necessary packages
RUN apt-get update && \
    apt-get install -y curl git vim zsh sudo locales tree software-properties-common gnupg && \
    rm -rf /var/lib/apt/lists/* # Clean up apt cache to reduce image size

# Set timezone to JST
ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set locale to Japanese
RUN locale-gen ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8

# Install Node.js (LTS version from NodeSource)
# The setup script runs apt-get update.
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/* # Clean up apt cache

# Optional: Install a simple HTTP server globally for previewing HTML/JS/CSS
# You can add other useful global npm packages here, e.g., linters, bundlers if needed globally
RUN npm install -g http-server \
    @biomejs/biome

# Set working directory
WORKDIR /workspace

# Set default command
# Note: docker-compose service command in compose.yml overrides this CMD
CMD [ "/bin/zsh" ]