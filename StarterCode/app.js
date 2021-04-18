//Read json and metadata for panel
function MetaData(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      console.log(metadata);
    var samplearray = metadata.filter(sampleObj => sampleObj.id == sample);
    var received = samplearray[0];
    var paneldata = d3.select("#sample-metadata");

    panelData.html("");
    Object.entries(received).forEach(([key, value]) => {
      paneldata.append("h6").text(`${key}: ${value}`);
    });
  });
}

function DrawCharts(sample) {
    d3.json("samples.json").then((data) => {
      var sampleData = data.samples;
      var samplearray = sampleData.filter(sampleObj => sampleObj.id == sample);
      var received = samplearray[0];
  
      var otu_ids = received.otu_ids;
      var otu_labels = received.otu_labels;
      var sample_values = received.sample_values;

      // Build a Bubble Chart
    var bubblechart = {
        title: "Bacteria",
        xaxis: {title: "OTU ID"},
        yaxis: sample_values,
        height: 600,
        width: 1000
    };
    var data4bubble = [
    {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "RdBu"
        }
      }
    ];
    
  
      Plotly.newPlot("bubble", data4bubble, bubblechart);
      
      //Create a horizontal bar chart
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [
        {
          y: yticks,
          x: sample_values,
          text: otu_labels,
          type: "bar",
          orientation: "h",
        }
      ];
  
      var chartLayout = {
        title: "Top 10 OTU",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, chartLayout);
    });
  };

  function init() {
    var dropdown = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      var name = data.names;
  
      name.forEach((sample) => {
        dropdown
          .append("option")
          .text(sample)
          .property("value", sample);
      })
  
      // Use sample data to build the plots
      var sampleData = name[0];
      DrawCharts(sampleData);
      MetaData(sampleData);
    });
  };
  
  function optionChanged(newSample) {
    DrawCharts(newSample);
    MetaData(newSample);
  };

  init()