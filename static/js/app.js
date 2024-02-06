//Get the samples endpoint(JSON URL)
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


// Initializes the page with a default plot,dropdown,panel
function init() {

  // Use D3 to select the dropdown menu
  let dropDown= d3.select("#selDataset");

  //Fetch the JSON data
  d3.json(url).then(function(data) {
    console.log(data);
    //Get id from JSON data and bind it to dropdown
     let names = data.names;
     console.log("ID:",names)
     names.forEach(id => {
      option=dropDown.append("option");
      option.text(id);
      option.property("value",id);
      //option.style.padding=0;

     });
     //Load panel with initial ID
     loadPanel(names[0]);
     loadPlot(names[0]);
     
    
  });
  
};

//Display panel based on ID selected
function loadPanel(id){

  // Use D3 to select the panel
  let panel= d3.select("#sample-metadata");
  panel.selectAll("p").remove();
  //panel.append("p").text(" ");
  //Get metadata from JSON data  and display key value pair in the panel for given ID
  d3.json(url).then(function(data) {
    let allData = data.metadata;
    let metaData = allData.filter(row => row.id == id); 
    console.log("metadata:",metaData);
    metaData.forEach((row) => {
      Object.entries(row).forEach(([key,value]) => {
        console.log(key + ": " + value);
        panel.append("p").text(key + ": " + value);
        
      });
    });
  });
  
};
//Display bar and bubble chart based on ID selected
function loadPlot(id){

  ////Get samplevalues from JSON data
  d3.json(url).then(function(data) {

    let allSamples =data.samples
    let sampleValues =allSamples.filter(row => row.id == id); 
    console.log("samplevalues:",sampleValues);      
    let otu_ids =sampleValues[0].otu_ids;
    let sample_values= sampleValues[0].sample_values;
    let otu_lables = sampleValues[0].otu_labels;
    
    let xvalues = sample_values.slice(0,10).reverse();
    let yvalues = otu_ids.map(y => `OTU ${y}`).slice(0,10).reverse();
    let lables = otu_lables.slice(0,10).reverse();

    // set param for bar chart
    let trace = {
      x: xvalues,
      y: yvalues,
      text: lables,
      type: "bar",
      orientation: "h"
      
    };
  
    let data2 = [trace];
  
    let bar_layout = {
      title: "Top 10 OTUs found in individuals",
      xaxis: {title: "Sample Values", automarging:true},
      yaxis: {title: "OTU ID",automarging:true}
    
      
    };
  
     // set param for bubble chart
        
    
    let trace2 = {
      x: otu_ids ,
      y: sample_values,
      text: otu_lables,
      mode: "markers",
      marker: {
       size: sample_values,
       color: otu_ids,
       colorscale: "Earth"  
      }
    
    };
   
  
    let data3= [trace2];
    let bubble_layout = {
      title: "OTU found in each Samples",
      xaxis: {title: "OTU ID", automarging:true},
      yaxis: {title: "Sample Values", automarging:true}
    };
  
    Plotly.newPlot("bar", data2, bar_layout);  
    Plotly.newPlot("bubble",data3,bubble_layout);
    

 
  });



};
// This function is called when a dropdown menu item is selected
function optionChanged(value) {
 
 // ReLoad the plot,panel with new ID selected 
  loadPanel(value);
  loadPlot(value);
    
} ;


 

init();

