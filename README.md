# SSOT specs dashboard

Dashboard for displaying hardware and network configuration of servers.

> [!NOTE]
> This project is part of a suite of projects that work together. For all other related projects, see this search query: [`owner:2zqa topic:ssot`](https://github.com/search?q=owner%3A2zqa+topic%3Assot&type=repositories)

## Getting started

### Prerequisites

- Node.js (version 18.x or higher)
- npm (version 10.x or higher)
- [ssot-specs-server]

### Setup

1. Clone the [ssot-specs-server] repository and follow the instructions in its README to set it up. Note the client ID that you set.
2. Copy the `.env.example` file to `.env` and fill in the values.
3. Ensure that the GitLab account you are using has a public facing email address and that it is verified.

### Running the project

Ensure that [ssot-specs-server] is running. Then, follow these steps:

1. `git clone https://github.com/2zqa/ssot-specifications-dashboard.git`
2. `cd ssot-specifications-dashboard`
3. `npm install`
4. `npm start`

## License

SSOT specifications dashboard is licensed under the [MIT](LICENSE) license.

## Acknowledgements

- [Voys](https://www.voys.nl/) for facilitating the internship where this project was developed

[ssot-specs-server]:https://github.com/2zqa/ssot-specs-server
