import React from "react";
import { Helmet } from "react-helmet";
import Paper from "@material-ui/core/Paper";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  IconButton,
  Menu,
  Chip,
  Select,
  InputLabel,
  MenuItem,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Fab from "@material-ui/core/Fab";
import GetAppIcon from "@material-ui/icons/GetApp";
import makeStyles from "@material-ui/core/styles/makeStyles";
import EditIcon from "@material-ui/icons/Edit";
import CustomSnackBar from "../../CustomSnackBar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { GET_ENTITY_COLOR } from "../../../config";
import PatternVisualization from "./PatternVisualization";
import CreateOrEditPatternDialog from "./CreateOrEditPatternDialog";
import CommentsView from "./Comments/CommentsView";
import ReactHtmlParser from "react-html-parser";
import Icon from "@material-ui/core/Icon";
import { REGEX_PATTERNS_URL_LOCAL, REGEX_ID_SEARCH } from "../../../constants";
import ItemsService from "../../../services/ItemsService";
import "../../../styles/MuiChip.css";
import Quill from "quill";
import RemoveIcon from "@material-ui/icons/RemoveRounded";
import { IndentStyle } from "./indent.js";

const useStyles = makeStyles((theme) => {
  const chip = {
    margin: theme.spacing(1, 1, 0, 0),
    padding: theme.spacing(1, 1, 1, 0),
    maxWidth: "90%",
  };
  return {
    root: {
      marginTop: theme.spacing(5),
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: theme.palette.common.white,
    },
    paper: {
      padding: theme.spacing(2, 5, 0, 5),
      [theme.breakpoints.up("md")]: {
        margin: theme.spacing(0, 10, 10, 10),
      },
    },
    paperComments: {
      padding: theme.spacing(2, 9, 2, 9),
      [theme.breakpoints.up("md")]: {
        margin: theme.spacing(0, 10, 10, 10),
      },
    },
    title: {
      marginBottom: theme.spacing(1),
    },
    chip: {
      ...chip,
    },
    chipLabel: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100%",
    },
    chipRelations: {
      ...chip,
      color: theme.palette.common.white,
    },
    button: {
      marginRight: theme.spacing(1),
    },
    fab: {
      position: "fixed",
      bottom: theme.spacing(4),
      right: theme.spacing(5),
    },
    patternHeader: {
      verticalAlign: "middle",
    },
    circle: {
      color: theme.palette.primary.contrastText,
      margin: theme.spacing(1),
      borderRadius: "50%",
      height: "50px",
      width: "50px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    paperBackground: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      paddingTop: theme.spacing(7),
      marginBottom: "-100px",
    },
    imageIcon: {
      height: "100%",
      filter: "invert(1)",
    },

    clapbutton: {
      position: "fixed",
      bottom: theme.spacing(5),
      left: theme.spacing(2),
      color: "#fff",
      opacity: "0.8",
      backgroundColor: "rgb(240, 240, 240)",
      "&:hover, &:focus": {
        backgroundColor: "#fff",
        color: "rgb(25, 91, 139)",
        transform: "scale(1)",
        filter: "drop-shadow(0 3px 12px rgba(0, 0, 0, 0.05))",
        transition: "all .1s ease-in",
        zIndex: "1",
        pointerEvents: "visible",
        animation: "clap 1s ease-in-out forwards",
        transition: "border-color 0.3s ease-in",
        boxShadow: "0 0 5px 5px",
      },
      "&:after": {
        animation: "shockwave 1s ease-in infinite",
      },
    },

    iconRoot: {
      textAlign: "center",
      marginRight: theme.spacing(1),
    },
    fabDownload: {
      position: "fixed",
      bottom: theme.spacing(4),
      left: theme.spacing(5),
    },
  };
});

const SinglePatternViewComponent = (props) => {
  const {
    history,
    data,
    comments,
    entity,
    positionData,
    actualData,
    linkData,
    hovered,
    selectedItem,
    height,
    width,
    nodeRadius,
    handleNodeEnter,
    handleNodeLeave,
    handleNodeClick,
  } = props;
  const [isEditPatternDialogOpen, setIsEditPatternDialogOpen] = React.useState(
    false
  );

  Quill.register(IndentStyle, true);

  const [showToast, setShowToast] = React.useState(false);
  const classes = useStyles();
  const [clapData, setClapData] = React.useState([]);
  const [clapCount, setClapCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  var updateddata = [];

  const [expanded, setExpanded] = React.useState(
    Object.keys(data).map((value, index) => (index === 0 ? index : -1))
  );

  const isDataEmpty = () =>
    Object.keys(data)
      .filter((key) => !["id", "name", "identifier"].includes(key))
      .filter((key) => !(Array.isArray(data[key]) && data[key].length === 0))
      .length !== 0;

  const handleChipClick = (identifier, entity) => {
    history.push(`/patterns/${entity}/${identifier}`);
    window.location.reload();
  };

  var parts = [];

  const selectedEntity = entity;

  if (selectedEntity === "Anti Patterns") {
    parts = [
      {
        title: "Anti Pattern Overview",
        sections: [
          {
            attributes: [
              {
                heading: "Alias",
                content: data.alias || "-",
              },
              {
                heading: "Summary",
                content: data.summary || "-",
              },
            ],
          },
        ],
      },
    ];

    updateddata = {
      "": "",
      Example: data.example,
      Context: data.context,
      Problem: data.problem,
      Forces: data.forces,
      "General Form": data.generalForm,
      Variants: data.variants,
      Consequences: data.consequences,
      "Revised Solution": data.revisedSolution,
    };
  }

  if (selectedEntity === "Principles") {
    parts = [
      {
        title: "Principle Overview",
        sections: [
          {
            attributes: [
              {
                heading: "Alias",
                content: data.alias || "-",
              },
              {
                heading: "Type",
                content: data.type || "-",
              },
              {
                heading: "Binding Nature",
                content:
                  data.bindingNature.length > 0
                    ? data.bindingNature
                    : undefined || "-",
              },
            ],
          },
        ],
      },
    ];

    updateddata = {
      "": "",
      Context: data.context,
      Problem: data.problem,
      Forces: data.forces,
      Variants: data.variants,
      Consequences: data.consequences,
      "See Also": data.seeAlso,
      "Other Standards": data.otherStandards,
      "Known Uses": data.knownUses,
    };
  }

  if (selectedEntity === "Visualization Patterns") {
    parts = [
      {
        title: "V-Pattern Overview",
        sections: [
          {
            attributes: [
              {
                heading: "Alias",
                content: data.alias || "-",
              },
              {
                heading: "Summary",
                content: data.summary || "-",
              },
              {
                heading: "Type",
                content: data.type || "-",
              },
            ],
          },
        ],
      },
    ];

    updateddata = {
      "": "",
      Example: data.example,
      Context: data.context,
      Problem: data.problem,
      Forces: data.forces,
      Solution: data.solution,
      Variants: data.variants,
      Consequences: data.consequences,
      "See Also": data.seeAlso,
      "Other Standards": data.otherStandards,
      "Known Uses": data.knownUses,
    };
  }

  if (selectedEntity === "Coordination Patterns") {
    parts = [
      {
        title: "CO-Pattern Overview",
        sections: [
          {
            attributes: [
              {
                heading: "Alias",
                content: data.alias || "-",
              },
              {
                heading: "Summary",
                content: data.summary || "-",
              },
            ],
          },
        ],
      },
    ];

    updateddata = {
      "": "",
      Example: data.example,
      Context: data.context,
      Problem: data.problem,
      Forces: data.forces,
      Solution: data.solution,
      Variants: data.variants,
      Consequences: data.consequences,
      "Known Uses": data.knownUses,
    };
  }

  if (selectedEntity === "Methodology Patterns") {
    parts = [
      {
        title: "M-Pattern Overview",
        sections: [
          {
            attributes: [
              {
                heading: "Alias",
                content: data.alias || "-",
              },
              {
                heading: "Summary",
                content: data.summary || "-",
              },
            ],
          },
        ],
      },
    ];

    updateddata = {
      "": "",
      Example: data.example,
      Context: data.context,
      Problem: data.problem,
      Forces: data.forces,
      Solution: data.solution,
      Variants: data.variants,
      Consequences: data.consequences,
      "See Also": data.seeAlso,
      "Known Uses": data.knownUses,
    };
  }

  if (selectedEntity === "Concerns") {
    parts = [
      {
        title: "Concern Overview",
        sections: [
          {
            attributes: [
              {
                heading: "Category",
                content: data.category || "-",
              },
              {
                heading: "Scale Level",
                content: data.scalingLevel || "-",
              },
            ],
          },
        ],
      },
    ];

    updateddata = {
      "": "",
      Principles: data.principles,
      "Visualization Pattern": data.visualizationPatterns,
      CoordinationPatterns: data.coordinationPatterns,
      "Methodology Pattern": data.methodologyPatterns,
    };
  }

  if (selectedEntity === "Stakeholders") {
    parts = [
      {
        title: "Concern Overview",
        sections: [
          {
            attributes: [
              {
                heading: "Category",
                content: data.category || "-",
              },
              {
                heading: "Scale Level",
                content: data.scalingLevel || "-",
              },
            ],
          },
        ],
      },
    ];
    updateddata = {
      "": "",
      Concerns: data.concerns,
    };
  }

  const [expandedOverview, setExpandedOverview] = React.useState(
    parts.map((part, index) => index)
  );

  const handleEditPatternDialogOpen = () => {
    setIsEditPatternDialogOpen(true);
  };
  const handleEditPatternDialogClose = (success) => {
    setIsEditPatternDialogOpen(false);
    if (success) setShowToast(true);
  };

  const handlePanelChange = (index) => () => {
    setExpanded(
      expanded.indexOf(index) !== -1
        ? expanded.filter((item) => item !== index)
        : [...expanded, index]
    );
  };

  const handleOverviewPanelChange = (index) => () => {
    setExpandedOverview(
      expandedOverview.indexOf(index) !== -1
        ? expandedOverview.filter((item) => item !== index)
        : [...expandedOverview, index]
    );
  };

  const sendClapCount = () => {
    let present = false;
    let id = "";
    for (var i = 0; i < clapData.length; i++) {
      if (clapData[i].name == data.identifier) {
        present = true;
        id = clapData[i].id;
        break;
      }
    }

    if (present) {
      ItemsService.updateClapCount(id, data.identifier, data.name, clapCount);
    } else {
      ItemsService.createClapCount(data.identifier, data.name);
    }

    setClapCount(clapCount + 1);
  };

  const calculateClapCount = () => {
    if (clapData.length == 0) {
      setClapCount(0);
    } else {
      for (var i = 0; i < clapData.length; i++) {
        if (clapData[i].name == data.identifier) {
          setClapCount(parseInt(clapData[i].claps));
          break;
        }
      }
    }
  };

  const downloadPaternCatalog = (type, list) => {
    setIsLoading(true);
    ItemsService.downloadCatalog(type, list).then((response) => {
      setTimeout(() => {
        window.location.href = "http://localhost:5000/api/v1/latex/download";
        setIsLoading(false);
      }, 10000);
    });
  };

  React.useEffect(() => {
    setTimeout(() => {
      if (localStorage.getItem("authentication")) {
        const authentication = JSON.parse(
          localStorage.getItem("authentication")
        );
      }

      const clapCountFromBackend = ItemsService.getClapCount();
      clapCountFromBackend.promise.then((data) => {
        setClapData(data.value);
        data.value.forEach((record) => clapData.push(record));
        calculateClapCount();
        console.log(data);
      });
    }, 100);
  }, []);

  const renderChipsUsingRegex = (data) => {
    var urlRegExp = new RegExp(REGEX_PATTERNS_URL_LOCAL, "g");
    var patternIdRegExp = new RegExp(REGEX_ID_SEARCH);
    var htmlString = data;
    var dataArray = urlRegExp.exec(htmlString);
    // Check for multiple matches
    if (dataArray && dataArray.length > 0) {
      var matchesArray = dataArray[0].split("</a> ");
      if (matchesArray.length > 1) {
        // Multiple matches
        for (var a = 0; a < matchesArray.length; a++) {
          if (a === matchesArray.length - 1) {
            // Last element, don't append end tag
            var patternInfo = patternIdRegExp.exec(matchesArray[a]);
            var patternId = patternInfo[0].split("/");
            var stringToReplace = `${matchesArray[a]}`;
            var replacement = `<a href="http://localhost:8000/#/patterns/${patternInfo[1]
              }/${patternId[1]
              }" style={{ text-decoration: "none" }}><div role="button" class="MuiChip-root MuiChip-colorPrimary MuiChip-clickableColorPrimary MuiChip-clickable" tabindex="0"><span class="MuiChip-label">${patternInfo[1]
                .replace("%20", " ")
                .slice(0, -1)} ${patternId[1]}</span></div></a>`;
            htmlString = htmlString.replace(stringToReplace, replacement);
          } else {
            // Only one match
            matchesArray[a] = matchesArray[a] + "</a>";
            var patternInfo = patternIdRegExp.exec(matchesArray[a]);
            var patternId = patternInfo[0].split("/");
            var stringToReplace = `${matchesArray[a]}`;
            var replacement = `<a href="http://localhost:8000/#/patterns/${patternInfo[1]
              }/${patternId[1]
              }" style={{ text-decoration: "none" }}><div role="button" class="MuiChip-root MuiChip-colorPrimary MuiChip-clickableColorPrimary MuiChip-clickable" tabindex="0"><span class="MuiChip-label">${patternInfo[1]
                .replace("%20", " ")
                .slice(0, -1)} ${patternId[1]}</span></div></a>`;
            htmlString = htmlString.replace(stringToReplace, replacement);
          }
        }
      } else {
        var patternInfo = patternIdRegExp.exec(dataArray[0]);
        var patternId = patternInfo[0].split("/");
        var stringToReplace = `${dataArray[0]}`;
        var replacement = `<a href="http://localhost:8000/#/patterns/${patternInfo[1]
          }/${patternId[1]
          }" style={{ text-decoration: "none }}><div role="button" class="MuiChip-root MuiChip-colorPrimary MuiChip-clickableColorPrimary MuiChip-clickable" tabindex="0"><span class="MuiChip-label">${patternInfo[1]
            .replace("%20", " ")
            .slice(0, -1)} ${patternId[1]}</span></div></a>`;
        htmlString = htmlString.replace(stringToReplace, replacement);
      }
    }
    return htmlString;
  };

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{`${entity} \u2013 ${data.name}`}</title>
      </Helmet>
      <PatternVisualization
        displayDynamic={false}
        positionData={positionData}
        linkData={linkData}
        height={height}
        width={width}
        nodeRadius={nodeRadius}
        hovered={hovered}
        handleNodeEnter={handleNodeEnter}
        handleNodeLeave={handleNodeLeave}
        searched={[]}
        onPath={[]}
        selectedItem={selectedItem}
        handleNodeClick={handleNodeClick}
      />
      <Paper square elevation={24} className={classes.paperBackground}>
        <Paper
          elevation={6}
          className={classes.paper}
          style={{ paddingBottom: "30px" }}
        >
          <div style={{ display: "flex" }}>
            <Typography className={classes.patternHeader} variant="h5">
              {entity}
            </Typography>
            <div style={{ flexGrow: 1 }}></div>
            <div
              className={classes.circle}
              style={{ backgroundColor: GET_ENTITY_COLOR(entity) }}
            >
              <Typography>{data.identifier}</Typography>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <Typography className={classes.title} variant="h4">
              {data.name}
            </Typography>
            <div style={{ flexGrow: 1 }}></div>
          </div>
          {isDataEmpty() && <Divider />}
          <div style={{ display: "block", marginTop: "20px" }}>
            {parts.map((part, index) => (
              <ExpansionPanel
                key={index}
                expanded={expandedOverview.indexOf(index) !== -1}
                onChange={handleOverviewPanelChange(index)}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${index}-content`}
                  id={`panel-${index}-header`}
                >
                  <Typography variant="h6">{part.title}</Typography>
                </ExpansionPanelSummary>
                <Divider />

                {part.sections.map((section, index) => (
                  <ExpansionPanelDetails
                    key={index}
                    style={{ display: "block" }}
                  >
                    <Typography variant="h5">{section.sectionName}</Typography>
                    <table style={{ borderSpacing: "0px 20px" }}>
                      <tbody>
                        {section.attributes.map((attribute, index) => (
                          <tr key={index} style={{ border: "none" }}>
                            <td
                              style={{ width: "250px", paddingRight: "10px" }}
                            >
                              <Typography>{attribute.heading}</Typography>
                            </td>
                            <td>
                              {Array.isArray(attribute.content) ? (
                                attribute.content.map((item, index) => (
                                  <Typography>
                                    {ReactHtmlParser(
                                      renderChipsUsingRegex(
                                        item
                                          .replace('["', "")
                                          .replace('"]', "")
                                          .replace("[]", "-")
                                      )
                                    )}
                                  </Typography>
                                ))
                              ) : (
                                <Typography>
                                  {ReactHtmlParser(
                                    renderChipsUsingRegex(
                                      attribute.content &&
                                      attribute.content
                                        .replace('["', "")
                                        .replace('"]', "")
                                        .replace("[]", "-")
                                    )
                                  )}
                                </Typography>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {index < part.sections.length - 1 && <Divider light />}
                  </ExpansionPanelDetails>
                ))}
              </ExpansionPanel>
            ))}
          </div>
          <div
            style={{
              display: "block",
              marginTop: "20px",
              marginBottom: "30px",
            }}
          >
            {Object.keys(updateddata)
              .filter((key) => !["id", "name", "identifier"].includes(key))
              .map((key, index) => {
                if (
                  !(
                    Array.isArray(updateddata[key]) &&
                    updateddata[key].length === 0
                  ) &&
                  updateddata[key] !== null
                ) {
                  const title = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());
                  if (selectedEntity === "Anti Patterns") {
                    if (key === "summary" || key === "alias" || key === "") {
                      return null;
                    }
                  }

                  if (selectedEntity === "Coordination Patterns") {
                    if (key === "summary" || key === "alias" || key === "") {
                      return null;
                    }
                  }

                  if (selectedEntity === "Visualization Patterns") {
                    if (
                      key === "summary" ||
                      key === "alias" ||
                      key === "type" ||
                      key === ""
                    ) {
                      return null;
                    }
                  }

                  if (selectedEntity === "Principles") {
                    if (
                      key === "summary" ||
                      key === "alias" ||
                      key === "type" ||
                      key === "bindingnature" ||
                      key === ""
                    ) {
                      return null;
                    }
                  }

                  if (selectedEntity === "Methodology Patterns") {
                    if (key === "summary" || key === "alias" || key === "") {
                      return null;
                    }
                  }

                  if (selectedEntity === "Concerns") {
                    if (
                      key === "category" ||
                      key === "scalingLevel" ||
                      key === ""
                    ) {
                      return null;
                    }
                  }

                  if (selectedEntity === "Stakeholders") {
                    if (
                      key === "category" ||
                      key === "scalingLevel" ||
                      key === ""
                    ) {
                      return null;
                    }
                  }

                  return (
                    <ExpansionPanel
                      defaultExpanded={true}
                      key={index}
                      expanded={expanded.indexOf(index) === -1}
                      onChange={handlePanelChange(index)}
                    >
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${index}-content`}
                        id={`panel-${index}-header`}
                      >
                        <Typography variant="h6">{title}</Typography>
                      </ExpansionPanelSummary>
                      <Divider />
                      <ExpansionPanelDetails
                        key={index}
                        style={{ display: "block" }}
                      >
                        {Array.isArray(updateddata[key]) ? (
                          typeof updateddata[key][0] === "object" ? (
                            updateddata[key].map((item, index) => (
                              <Chip
                                key={index}
                                classes={{ label: classes.chipLabel }}
                                style={{
                                  backgroundColor: GET_ENTITY_COLOR(key),
                                }}
                                className={classes.chipRelations}
                                label={`${item.identifier} - ${item.name}`}
                                onClick={() =>
                                  handleChipClick(item.identifier, title)
                                }
                              />
                            ))
                          ) : updateddata[key].length > 0 ? (
                            updateddata[key].map((item, index) => (
                              <Typography>
                                {ReactHtmlParser(
                                  renderChipsUsingRegex(
                                    item
                                      .replace('["', "")
                                      .replace('"]', "")
                                      .replace("[]", "-")
                                  )
                                )}
                              </Typography>
                            ))
                          ) : (
                            "-"
                          )
                        ) : (
                          <Typography>
                            {" "}
                            {ReactHtmlParser(
                              renderChipsUsingRegex(
                                updateddata[key] &&
                                updateddata[key]
                                  .replace('["', "")
                                  .replace('"]', "")
                                  .replace("[]", "-")
                              )
                            )}
                          </Typography>
                        )}
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  );
                }
              })}
          </div>
        </Paper>
        <Paper elevation={6} className={classes.paperComments}>
          <CommentsView
            callBack={props.callBack}
            comments={comments}
            pattern={data.identifier}
            patternName={data.name}
          />
        </Paper>
      </Paper>

      {ItemsService.isLoggedIn() && ItemsService.isAdminAndVerified() ? (
        <Fab
          variant="extended"
          color="primary"
          aria-label="edit"
          className={classes.fab}
          onClick={handleEditPatternDialogOpen}
          style={{ backgroundColor: GET_ENTITY_COLOR(entity) }}
        >
          <EditIcon className={classes.button} />
          Edit
        </Fab>
      ) : null}

      <Fab
        variant="extended"
        color="primary"
        aria-label="add"
        className={classes.fabDownload}
        onClick={() => {
          downloadPaternCatalog("individual", [data.identifier]);
        }}
      >
        <GetAppIcon className={classes.button} />
        Download Pattern Catalog
        {isLoading && (
          <div
            style={{
              textAlign: "center",
              paddingLeft: "8px",
              paddingTop: "6px",
            }}
          >
            <CircularProgress size={18} thickness={3} color="white" />
          </div>
        )}
      </Fab>

      <CreateOrEditPatternDialog
        open={isEditPatternDialogOpen}
        handleClose={handleEditPatternDialogClose}
        type={entity}
        actualData={actualData.flat()}
        data={data}
        createOrEdit={"Edit"}
      />
      {showToast
        ? React.createElement(CustomSnackBar, {
          message: "Updated Successfully!",
        })
        : null}
    </div>
  );
};

export default SinglePatternViewComponent;
