export const surveyJson = {
  "title": "Sample survey — all question types, layout, and navigation",
  "description": "Demonstrates top navigation, progress, collapsible panels/questions, and side-by-side questions.",
  "logoPosition": "right",
  "showNavigationButtons": true,
  "navigationButtonsLocation": "top",
  "showProgressBar": true,
  "progressBarLocation": "aboveheader",
  "progressBarType": "pages",
  "progressBarShowPageTitles": true,
  "progressBarShowPageNumbers": true,
  "showPageTitles": true,
  "questionErrorLocation": "bottom",
  "pages": [
    {
      "name": "page_intro",
      "title": "Introduction & layout",
      "elements": [
        {
          "type": "html",
          "name": "welcome_html",
          "html": "<p><strong>Welcome.</strong> Use the <em>page strip</em> above and <em>Prev / Next</em> at the top to move between pages.</p>"
        },
        {
          "type": "text",
          "name": "first_name",
          "title": "First name",
          "isRequired": true,
          "maxWidth": "48%",
          "minWidth": "200px"
        },
        {
          "type": "text",
          "name": "last_name",
          "title": "Last name",
          "startWithNewLine": false,
          "maxWidth": "48%",
          "minWidth": "200px"
        },
        {
          "type": "panel",
          "name": "collapsible_panel",
          "title": "Collapsible panel (starts collapsed)",
          "description": "Click the title to expand or collapse.",
          "state": "collapsed",
          "elements": [
            {
              "type": "checkbox",
              "name": "panel_interests",
              "title": "Interests",
              "choices": ["Design", "Development", "Research"]
            },
            {
              "type": "radiogroup",
              "name": "panel_experience",
              "title": "Experience level",
              "choices": ["Beginner", "Intermediate", "Expert"]
            }
          ]
        }
      ]
    },
    {
      "name": "page_selection",
      "title": "Selection questions",
      "elements": [
        {
          "type": "dropdown",
          "name": "country",
          "title": "Country",
          "choices": ["United States", "Canada", "United Kingdom", "Germany", "Japan"],
          "maxWidth": "48%"
        },
        {
          "type": "tagbox",
          "name": "languages",
          "title": "Languages (multi-select)",
          "choices": ["English", "Spanish", "French", "German", "Japanese"],
          "startWithNewLine": false,
          "maxWidth": "48%"
        },
        {
          "type": "boolean",
          "name": "accept_terms",
          "title": "I accept the terms",
          "labelTrue": "Yes",
          "labelFalse": "No",
          "maxWidth": "48%"
        },
        {
          "type": "buttongroup",
          "name": "priority",
          "title": "Priority",
          "choices": ["Low", "Medium", "High"],
          "startWithNewLine": false,
          "maxWidth": "48%"
        },
        {
          "type": "checkbox",
          "name": "notify_channels",
          "title": "Notification channels",
          "choices": ["Email", "SMS", "Push"],
          "colCount": 3,
          "maxWidth": "48%"
        },
        {
          "type": "radiogroup",
          "name": "plan",
          "title": "Plan",
          "choices": ["Free", "Pro", "Enterprise"],
          "colCount": 3,
          "startWithNewLine": false,
          "maxWidth": "48%"
        },
        {
          "type": "ranking",
          "name": "feature_rank",
          "title": "Rank these features (most important first)",
          "choices": ["Speed", "Security", "Price", "Support"]
        },
        {
          "type": "rating",
          "name": "satisfaction",
          "title": "Overall satisfaction",
          "rateMin": 1,
          "rateMax": 5,
          "minRateDescription": "Poor",
          "maxRateDescription": "Excellent"
        },
        {
          "type": "text",
          "name": "collapsible_question_demo",
          "title": "Collapsible question (starts collapsed)",
          "description": "Expand to enter optional notes.",
          "state": "collapsed"
        }
      ]
    },
    {
      "name": "page_matrix",
      "title": "Matrix questions",
      "elements": [
        {
          "type": "matrix",
          "name": "matrix_single",
          "title": "Matrix (single choice per row)",
          "columns": [
            { "value": "col1", "text": "Poor" },
            { "value": "col2", "text": "OK" },
            { "value": "col3", "text": "Great" }
          ],
          "rows": [
            { "value": "r1", "text": "Ease of use" },
            { "value": "r2", "text": "Documentation" },
            { "value": "r3", "text": "Performance" }
          ]
        },
        {
          "type": "matrixdropdown",
          "name": "matrix_dropdown",
          "title": "Matrix dropdown",
          "columns": [
            {
              "name": "status",
              "title": "Status",
              "cellType": "dropdown",
              "choices": ["Open", "In progress", "Done"]
            },
            {
              "name": "notes",
              "title": "Notes",
              "cellType": "text"
            }
          ],
          "rows": [
            { "value": "task1", "text": "Task A" },
            { "value": "task2", "text": "Task B" }
          ]
        },
        {
          "type": "matrixdynamic",
          "name": "matrix_dynamic",
          "title": "Matrix dynamic (add rows)",
          "addRowText": "Add row",
          "columns": [
            { "name": "item", "title": "Item", "cellType": "text" },
            { "name": "qty", "title": "Qty", "cellType": "text", "inputType": "number" }
          ],
          "rowCount": 1,
          "minRowCount": 1
        }
      ]
    },
    {
      "name": "page_inputs",
      "title": "Text, panel dynamic, slider, file, signature",
      "elements": [
        {
          "type": "comment",
          "name": "feedback",
          "title": "Long feedback",
          "rows": 4,
          "maxWidth": "48%"
        },
        {
          "type": "multipletext",
          "name": "contact_parts",
          "title": "Contact (multiple fields)",
          "startWithNewLine": false,
          "maxWidth": "48%",
          "items": [
            { "name": "phone", "title": "Phone" },
            { "name": "email", "title": "Email" }
          ]
        },
        {
          "type": "paneldynamic",
          "name": "dependents",
          "title": "Dependents (dynamic panel)",
          "templateTitle": "Person #{panelIndex}",
          "panelCount": 1,
          "minPanelCount": 0,
          "templateElements": [
            { "type": "text", "name": "dep_name", "title": "Name" },
            {
              "type": "dropdown",
              "name": "dep_relation",
              "title": "Relation",
              "choices": ["Child", "Spouse", "Parent", "Other"]
            }
          ]
        },
        {
          "type": "slider",
          "name": "budget_percent",
          "title": "Budget allocation (%)",
          "min": 0,
          "max": 100,
          "step": 5,
          "maxWidth": "48%"
        },
        {
          "type": "text",
          "name": "companion_text",
          "title": "Companion field (same row as slider)",
          "startWithNewLine": false,
          "maxWidth": "48%"
        },
        {
          "type": "file",
          "name": "attachment",
          "title": "Attachment",
          "storeDataAsText": true,
          "allowMultiple": false
        },
        {
          "type": "signaturepad",
          "name": "signature",
          "title": "Signature",
          "signatureWidth": 400,
          "signatureHeight": 200
        }
      ]
    },
    {
      "name": "page_media",
      "title": "Image, image picker, image map, expression",
      "elements": [
        {
          "type": "image",
          "name": "hero_image",
          "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
          "imageHeight": 180,
          "imageWidth": 320
        },
        {
          "type": "imagepicker",
          "name": "mascot",
          "title": "Pick a mascot",
          "choices": [
            {
              "value": "lion",
              "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
            },
            {
              "value": "giraffe",
              "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
            },
            {
              "value": "panda",
              "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
            }
          ],
          "imageHeight": 120,
          "imageWidth": 180,
          "multiSelect": false
        },
        {
          "type": "imagemap",
          "name": "region_map",
          "title": "Image map (click a region)",
          "imageLink": "/imagemap-regions.png",
          "shape": "rect",
          "areas": [
            {
              "value": "north",
              "text": "North",
              "coords": "107,98,508,279"
            },
            {
              "value": "south",
              "text": "South",
              "coords": "107,295,508,477"
            }
          ]
        },
        {
          "type": "expression",
          "name": "today_display",
          "title": "Today (read-only)",
          "expression": "today()",
          "displayStyle": "date"
        },
        {
          "type": "expression",
          "name": "name_summary",
          "title": "Greeting",
          "expression": "iif({first_name} notempty, 'Hello, ' + {first_name} + '!', 'Hello!')"
        }
      ]
    }
  ]
}
