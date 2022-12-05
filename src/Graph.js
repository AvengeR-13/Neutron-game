export class Graph {

    drawGraph(data) {
        // set the dimensions and margins of the graph
        const height = 720

        document.querySelector('#my_dataviz').innerHTML = ''

        // append the svg object to the body of the page
        const svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", '100%')
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(40,60)");  // bit of margin on the left = 40

        // Create the cluster layout:
        const cluster = d3.cluster()
            .size([height, 500]);  // 100 is the margin I will have on the right side

        // Give the data to this cluster layout:
        const root = d3.hierarchy(data, function (d) {
            return d.children;
        });
        cluster(root);

        // Add the links between nodes:
        svg.selectAll('path')
            .data(root.descendants().slice(1))
            .join('path')
            .attr("d", function (d) {
                return "M" + d.x + "," + d.y
                    + " " + d.parent.x + "," + d.parent.y;
            })
            .style("fill", 'none')
            .attr("stroke", '#ccc')

        // Add a circle for each node.
        let node = svg.selectAll("g")
            .data(root.descendants())
            .join("g")
            .attr("transform", function (d) {
                return `translate(${d.x - 15},${d.y})`
            })

        node.append("text")
            .attr("dx", 0)
            .attr("dy", 0)
            .style("text-center", true)
            .text( function(d){ return d.data.name})
    }
}
