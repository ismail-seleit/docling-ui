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

## Installation

### Windows

1.  Download the latest `.exe` installer from the [releases page](https://github.com/ismail-seleit/docling-ui/releases).
2.  Double-click the installer to begin the installation.
3.  Follow the on-screen instructions to complete the installation.

### macOS

1.  Download the latest `.dmg` file from the [releases page](https://github.com/ismail-seleit/docling-ui/releases).
2.  Double-click the `.dmg` file to open it.
3.  Drag the Docling UI icon to your Applications folder.

## Development

To run the application in development mode:

1.  Clone this repository.
2.  Run `npm install` in the root directory.
3.  Run `npm install` in the `backend` directory.
4.  Run `npm run electron:start` in the root directory.

To build the application for Windows and macOS:

1.  Run `npm run electron:package:win` to build for Windows.
2.  Run `npm run electron:package:mac` to build for macOS.
