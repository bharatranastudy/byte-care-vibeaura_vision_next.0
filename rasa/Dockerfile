FROM rasa/rasa:3.6.0-full

# Switch to root to install packages
USER root

WORKDIR /app

# Copy Rasa configuration files
COPY . .

# Install basic multilingual support (simplified)
RUN pip install --no-cache-dir \
    langdetect \
    googletrans==4.0.0rc1

# Skip training at build time to prevent build failures due to training data conflicts
# You can run `rasa train` at runtime or after fixing rules/stories.
# RUN rasa train

EXPOSE 5005

CMD ["run", "--enable-api", "--cors", "*", "--debug"]
