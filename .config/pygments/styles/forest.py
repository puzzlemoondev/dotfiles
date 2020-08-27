from pygments.style import Style
from pygments.token import Keyword, Name, Comment, String, Error, Text, Number, Operator, Generic, Whitespace, Punctuation, Other, Literal

class ForestStyle(Style):
    default_style = ""

    background_color = "#323d43"
    highlight_color = "#465258"

    styles = {
        Text:                      "#d8caac",
        Error:                     "bg:#e68183",

        Comment:                   "#868d80",

        Keyword:                   "#89beba",
        Keyword.Constant:          "#d3a0bc",
        Keyword.Declaration:       "#89beba",
        Keyword.Namespace:         "italic #e68183",
        Keyword.Type:              "#89beba",

        Operator:                  "#e39b7b",

        Punctuation:               "#d8caac",

        Name:                      "#d8caac",
        Name.Attribute:            "#d9bb80",
        Name.Builtin.Pseudo:       "#d8caac",
        Name.Constant:             "#d3a0bc",
        Name.Decorator:            "#d9bb80",
        Name.Exception:            "#d9bb80",
        Name.Function:             "#a7c080",
        Name.Label:                "#d8caac",
        Name.Namespace:            "#d8caac",
        Name.Other:                "#d8caac",
        Name.Tag:                  "#e39b7b",
        Name.Variable:             "#d8caac",

        Number:                    "#d3a0bc",

        String:                    "#d9bb80",
        
        Generic.Emph:              "italic", 
        Generic.Strong:            "bold",   
    }
