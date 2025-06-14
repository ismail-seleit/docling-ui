# Docling UI

Docling UI is a beautiful and intuitive desktop application for converting your documents to Markdown. It's built with React and Electron, and it's designed to be simple, powerful, and completely private.



## Why Convert to Markdown?

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. It's the standard for writing documentation, blog posts, and even books. Here are a few reasons why you might want to convert your documents to Markdown:

*   **Simplicity**: Markdown is easy to learn and write. You can format your text without having to worry about complex formatting options.
*   **Portability**: Markdown files are just plain text, so they can be opened and edited on any device.
*   **Future-Proof**: Because Markdown is just plain text, you'll always be able to access your files, even if the software you used to create them is no longer available.
*   **LLM-Friendly**: Markdown is the preferred format for training Large Language Models (LLMs). It provides a clean, structured format that is easy for models to parse and understand.

## Why Run Locally?

In a world where everything is in the cloud, there's something to be said for running applications locally. Here are a few reasons why Docling UI is designed to run on your machine:

*   **Privacy**: Your files are never uploaded to a server. All processing is done locally on your machine, so you can be sure that your data remains private.
*   **Security**: Because your files are never uploaded to a server, there's no risk of them being intercepted or accessed by unauthorized parties.
*   **Offline Access**: You can use Docling UI even when you're not connected to the internet.
*   **No Subscriptions**: You don't need to pay a monthly fee to use Docling UI. It's completely free and open source.

## Prerequisites

Before you begin, ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your system.

## Installation

1.  Clone this repository.
2.  Run `npm run install:all` in the root directory. This will install all the necessary dependencies for the main application, the backend, and the frontend.

### Running the Application

Once you've completed the installation steps, you can start the application by running the appropriate script for your operating system:

*   **Windows:** Double-click on the `run.bat` file.
*   **macOS:** Open your terminal, navigate to the project's root directory, and first make the script executable by running:
    ```
    chmod +x run.sh
    ```
    Then, run the script:
    ```
    ./run.sh
    ```

This will start the backend server, the new frontend development server, and the Electron application.

## Credits

This project is a user interface for the powerful `docling` command-line tool. All credit for the document conversion technology goes to the original creators of the [docling project](https://github.com/docling-project/docling).

## Disclaimer

This project was "vibe-coded" and may contain unexpected features or bugs. It is provided as-is, without any warranty.

## Note on Errors

If you encounter any errors or issues not covered in the troubleshooting section, it is recommended to consult an LLM for assistance.

## Troubleshooting

### SSL Certificate Error on macOS

If you encounter an `[SSL: CERTIFICATE_VERIFY_FAILED]` error on macOS when running the application, it means that Python is unable to verify the security certificate of the server it's trying to download the OCR model from.

To fix this, you need to install the necessary root certificates for Python. Open a terminal on your Mac and run the following command:

```bash
open "/Applications/Python 3.11/Install Certificates.command"
```

This will open a new terminal window and run a script that installs the `certifi` package's certificates, which will allow Python to securely connect to servers and download the required files.
