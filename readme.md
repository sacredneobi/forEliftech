# Questionnaire Builder App

## Overview

The **Questionnaire Builder App** is a web-based application designed to create, manage, and complete questionnaires with varying complexity levels. It provides an interactive and user-friendly interface for building and filling out questionnaires.

## Features

### Base Level

- **Questionnaire Catalog Page**

  - Displays a paginated list of available questionnaires.
  - Each questionnaire card includes:
    - **Name**
    - **Description**
    - **Number of questions**
    - **Number of completions**
    - **Actions**: `Edit`, `Run`, `Delete`

- **Questionnaire Builder Page**

  - Users can create a questionnaire by adding multiple questions.
  - Supported question types:
    - **Text** - free-form user input
    - **Single choice** - user can select only one answer (radio buttons)
    - **Multiple choices** - user can select several answers (checkbox buttons)
  - Submitted questionnaires are stored in the database.

- **Interactive Questionnaire Page**
  - Users can complete a created questionnaire.
  - Displays user responses and completion time at the end.
  - Stores responses in the database.

### Middle Level

- Sorting feature in the **Questionnaire Catalog Page** by:
  - **Name**
  - **Number of questions**
  - **Number of completions**
- **Drag-and-drop functionality** for reordering questions/answers in the **Questionnaire Builder Page**.
- **Saves intermediate progress** in the **Interactive Questionnaire Page**, allowing users to resume after a refresh.

### Advanced Level

- **Infinite scroll pagination** in the **Questionnaire Catalog Page**.
- **Questionnaire Statistics Page** with:
  - **Average completion time**
  - **Number of completions per day/week/month** (line/bar chart)
  - **Pie chart** for question response distribution

## ❗ Unfinished Feature

The following feature has **not** been implemented:

- **Questionnaire Builder Page:** `Image` question type allowing users to upload images for this question during questionnaire completion.

## 🛠 Technologies Used

- **Frontend:** `REACT.JS` `MUI.com` `beautiful-react-hooks` `react-beautiful-dnd` `use-http`
- **Backend:** `Node.JS` `sequelize ORM` `express.js`
- **Database:** `PostgreSQl`

## 📞 Contact

For any inquiries, contact:

- **Email:** sacredneobi@gmail.com
- **Phone:** +38 096 671 60 07
- **Website:** [testskill.sacredapp.us](https://testskill.sacredapp.us)
- **Video instruction:** [video](https://youtu.be/LiBsjGPln98)
