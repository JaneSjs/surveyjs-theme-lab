# SurveyJS Theme Lab (React)

Next.js app for experimenting with **SurveyJS Form Library** themes: edit **Default Light** CSS variables live, preview them on a sample survey, and export or import theme JSON.

The grid displays theme variables except some groups of variables (scale, opacity, chart, etc.) For a full list of excluded variables, check commented out variables at **src/default-light.ts**.

> **SurveyJS version:** this demo uses **SurveyJS v3.0.0-beta.1** (`survey-react-ui` and related packages).

## How to use the app

1. **Run it locally** (development):

   ```bash
   npm install
   npm run dev
   ```

   Open the URL shown in the terminal (often [http://localhost:3000](http://localhost:3000); another port is used if 3000 is busy).

2. **Left side — survey preview**

   - Expand **Try these CSS variables first** for suggested variables to tweak.
   - The sample survey below updates as you change theme variables on the right.

3. **Right side — theme editor**

   - Search and edit **Default light — CSS variables** in the grid. Changes apply to the survey immediately.
   - **Upload theme**: load a JSON file previously exported from this app (must include a `cssVariables` object with keys this demo tracks).
   - **Save theme JSON**: download the current complete theme (including derived values) as JSON.

4. **Resize the columns**

   - Drag the **vertical bar** between the survey and the variable panel to give more space to either side. You can also focus the bar and use **Arrow Left / Arrow Right** (hold **Shift** for larger steps), **Home** / **End** for min/max width on the theme column.

5. **Scrolling**

   - The **left** and **right** areas scroll independently so long surveys and long variable lists stay usable.

## Production build

```bash
npm run build
npm run start
```

By default the production server listens on port 3000; set `PORT` if that port is already in use (e.g. `PORT=3010 npm run start` on Unix, or `$env:PORT='3010'; npm run start` in PowerShell).
