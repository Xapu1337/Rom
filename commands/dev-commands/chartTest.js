
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { MessageEmbed, MessageAttachment } = require('discord.js')


const width = 800
const height = 600
const chartCallback = (ChartJS) => {
    ChartJS.plugins.register({
        beforeDraw: (chartInstance) => {
            const { chart } = chartInstance
            const { ctx } = chart
            ctx.fillStyle = '#0f0f0f'
            ctx.fillRect(0, 0, chart.width, chart.height)
        },
    })
}


module.exports = {
    name: "chat",
    aliases: ["cjs", "chartjs"],
    category: "dev-commands",
    description: "Can't tell u",
    usage: "",
    permissions: "VERIFIED",
    run: async(client, message, args) => {
        // const data = eval("(function(){return " + args.join(" ") + ";})()");
        // console.log(data);
        let data = [];

        await eval("(async() => {" +
            args.join(" ") +
            "})();");
        const dataText = [];
        const dataValue = [];

        for (const item of data) {
            dataText.push(item.dataText)
            dataValue.push(item.dataValue)
        }

        const canvas = new ChartJSNodeCanvas({width, height, chartCallback})

        const configuration = {
            type: '',
            data: {
                labels: dataText,
                datasets: [
                    {
                        label: 'SOMEBODY ONCE TOLD ME!',
                        data: dataValue,
                        backgroundColor: '#3476fa',
                        labelColor: '#fff',
                    },
                ],
            },
        }

        const image = await canvas.renderToBuffer(configuration)

        const attachment = new MessageAttachment(image)

        message.channel.send(attachment)
    }
}