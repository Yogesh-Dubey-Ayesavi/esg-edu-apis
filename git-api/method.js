  const { Octokit } = require('@octokit/core');
  const { createTokenAuth } = require('@octokit/auth-token');

  class GitMethods {
    constructor(token, params, body) {
      // Move these properties to the constructor if they are supposed to be instance properties
      this.params = params;
      this.body = body;
      this.owner = 'yogesh-dubey-ayesavi';
      this.repoName = 'sih-2023';

      // Initialize Octokit instance with the provided token
      this.octokit = new Octokit({ auth: token });
      this.auth = createTokenAuth(token);
    }

    // Main method to handle various requests
    async callMethod() {
      try {
        if ("list" in this.params) {
          return await this.handleListRequest();
        } else if ("get_content" in this.params) {
          return await this.handleGetContentRequest();
        } else if ("type" in this.params && this.params.type == "create" && "path" in this.params) {
          return await this.handleCreateRequest();
        } else if ("type" in this.params && this.params.type == "update" && "sha" in this.params && "path" in this.params) {
          return await this.handleUpdateRequest();
        } else if (this.params?.type == "delete" && "sha" in this.params && "path" in this.params) {
          return await this.handleDeleteRequest();
        } else {
          throw "Invalid request parameters";
        }
      } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error;
      }
    }

    // Helper method to handle "list" request
    async handleListRequest() {
      let key = this.params.list;
      if (["environment", "social", "governance"].includes(key)) {
        const response = await this.getContent(this.owner, this.repoName, `client/docs/${key}`);
        return  response.map((e)=>{
            const  { sha, path, name, type } = e;
            let filePath = this.extractLastDir(path)
            let fileName = this.extractFileNameWithoutExtension(name)
            return { sha :sha, path:filePath, name:fileName, type:type };
        });
        
      } else {
        throw new Error("Invalid key received; it must be one of environment, social, and governance");
      }
    }

    // Helper method to handle "get_content" request
    async handleGetContentRequest() {
      const { sha, path, name, type, content } = await this.getContent(this.owner, this.repoName, `client/docs/${this.params.get_content}`  );
      let filePath = this.extractLastDir(path)
            let fileName = this.extractFileNameWithoutExtension(name)
      return { sha : sha, path:filePath, name:fileName, type:type, content: Buffer.from(content, 'base64').toString('utf-8')};
    }

    // Helper method to handle "create" request
    async handleCreateRequest() {
      let filePath = this.params.path;
      let body = this.body.content;
      return await this.createFile(this.owner, this.repoName, `client/docs/${filePath }`, body, `added ${filePath.substring(filePath.lastIndexOf('/') + 1)}`);
    }

    // Helper method to handle "update" request
    async handleUpdateRequest() {
      let filePath = this.params.path;
      let body = this.body.content;
      let sha = this.params.sha;
      return await this.updateFile(this.owner, this.repoName, `client/docs/${filePath }`, body, sha, `updated ${filePath.substring(filePath.lastIndexOf('/') + 1)}`);
    }

    // Helper method to handle "delete" request
    async handleDeleteRequest() {
      let filePath = this.params.path;
      return await this.deleteFile(this.owner, this.repoName, `client/docs/${filePath }`, `deleted  ${filePath.substring(filePath.lastIndexOf('/') + 1)}`);
    }

    async createFile(owner, repo, path, content, commitMessage) {
      try {
        const response = await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path,
          message: commitMessage,
          committer: {
            name: 'Yogesh Dubey',
            email: 'yogesh.dubey.0804@gmail.com'
          },
          content: Buffer.from(content).toString('base64'),
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        console.log(`File "${path}" created successfully.`);
        return response.data;
      } catch (error) {
        console.error(`Error creating file "${path}": ${error.message}`);
        throw new Error(`Failed to create file: ${error.message}`);
      }
    }

    async getContent(owner, repo, path) {
      try {
        const response = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path,
        });
        return response.data;
      } catch (error) {
        console.error(`Error reading file "${path}": ${error.message}`);
        throw new Error(`Failed to read file: ${error.message}`);
      }
    }

    async updateFile(owner, repo, path, content, sha, commitMessage) {
      try {
        const response = await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path,
          message: commitMessage,
          committer: {
            name: 'Yogesh Dubey',
            email: 'yogesh.dubey.0804@gmail.com'
          },
          content: Buffer.from(content).toString('base64'),
          sha: sha,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        console.log(`File "${path}" updated successfully.`);
        return response.data;
      } catch (error) {
        console.error(`Error updating file "${path}": ${error.message}`);
        throw new Error(`Failed to update file: ${error.message}`);
      }
    }

    async deleteFile(owner, repo, path, commitMessage) {
      try {
        const response = await this.octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path,
          message: commitMessage,
          sha: this.params.sha, // Make sure you have the correct sha
        });
        console.log(`File "${path}" deleted successfully.`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting file "${path}": ${error.message}`);
        throw new Error(`Failed to delete file: ${error.message}`);
      }
    }

     extractFileNameWithoutExtension(name) {
      return name.substring(0,name.lastIndexOf("."))
    }
    
   
    
     extractLastDir(path) {
      // Split the path into an array using '/'
      const pathArray = path.split('/');
    
      // Check if the path has at least two elements (directory and file)
      if (pathArray.length >= 2) {
        // Get the last two elements
        const [lastDir, lastFile] = pathArray.slice(-2);
    
        // Return the last directory and file (without extension) joined with '/'
        return `${lastDir}/${this.extractFileNameWithoutExtension(lastFile)}`;
      } else {
        // If there are less than two elements, return the original path
        return path;
      }
    }
    
    validatePath(){
              // Define valid keywords
        const validKeywords = ['environment', 'social', 'governance'];

        // Check if the path has a trailing slash
        if (path.endsWith('/')) {
          throw new Error('Path cannot have a trailing slash.');
        }

        // Split the path by '/'
        const pathSegments = path.split('/');

        // Check if there is exactly one slash and the first segment is a valid keyword
        if (pathSegments.length === 2 && validKeywords.includes(pathSegments[0])) {
          return true;
        } else {
          return false;
        }
          }

  }

  module.exports = GitMethods ;