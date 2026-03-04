# How to Deploy to Live (Vercel)

Since you have a Next.js application, the easiest and best way to deploy is using **Vercel** (the creators of Next.js).

## Option 1: The Quickest Way (No Git required)

Since you are running this locally and might not have Git set up, you can deploy directly from your command line using the Vercel CLI.

1.  **Stop your local server**
    Press `Ctrl + C` in your terminal to stop the `npm run dev` command if it's running.

2.  **Run the deployment command**
    Run the following command in your terminal folder:
    ```bash
    npx vercel
    ```

3.  **Follow the prompts**
    -   **Set up and deploy?** [Y]
    -   **Which scope?** (Select your account or create one)
    -   **Link to existing project?** [N]
    -   **Project Name?** (Press Enter to use `flutterheadless` or type a name like `sobha-dubai-poc`)
    -   **In which directory is your code located?** (Press Enter for `./`)
    -   **Want to modify these settings?** [N]

    The tool will verify your build and deploy it. You will get a **Production URL** (e.g., `https://sobha-dubai-poc.vercel.app`) that you can share immediately.

## Option 2: The Professional Way (via GitHub)

If you have Git installed and a GitHub account:

1.  Initialize a git repository: `git init`
2.  Commit your code:
    ```bash
    git add .
    git commit -m "Initial commit"
    ```
3.  Create a new repository on GitHub and push your code.
4.  Go to [Vercel.com](https://vercel.com) and log in.
5.  Click **"Add New..."** -> **"Project"**.
6.  Import your GitHub repository.
7.  Click **"Deploy"**.

## Managing Content After Deployment

Because we moved the configuration to `src/site-content.json`, if you want to update the "Just Arrived" text or collection IDs:
1.  Edit `src/site-content.json` locally.
2.  Re-run `npx vercel --prod` to update the live site.
