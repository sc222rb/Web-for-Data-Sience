# Project Title

Beehive Environmental Monitoring Dashboard.

## 🎥 Demo
[![▶️ Watch Demo on YouTube](https://img.youtube.com/vi/zjLYnyyKxxI/0.jpg)](https://www.youtube.com/watch?v=zjLYnyyKxxI)



## Project Description  

This application provides an interactive visualization of beehive data from two locations, Würzburg and Schwartau, collected from Jan 2017 to May 2019. 
The dataset was taken from Kaggle here: [Beehive metrics on Kaggle](https://www.kaggle.com/datasets/se18m502/bee-hive-metrics/data). The aim of this project is to give insights into the health and activity of the beehives by analyzing various parameters such as the number of bee arrivals and departures, temperature, humidity, and hive weight.

MERNスタックを用いて、2拠点の養蜂場から収集された2017年から2019年までの約200万件の時系列データを統合管理・可視化するWebアプリケーションを開発しました。MongoDBのAggregation Pipelineを活用して1時間単位のデータ集約処理を実装し、APIのレスポンス時間を削減しました。また、hiveIdとtimestampの複合インデックスを用いることで検索性能を最適化し、RESTfulAPIをバージョニング対応で設計しました。さらに、KaggleAPIからのCSVデータを自動取得し、解析・バッチインサートする処理を構築するとともに、5か月間の欠損データに対しても適切に対応し、エラーが発生した場合のハンドリングも実装しました。
ユーザーインターフェースでは、日付範囲フィルターで選択した期間の蜜蜂の出入りや温度、湿度、巣箱の重量をPlotly.jsを用いたインタラクティブなチャートで表示し、複数の巣箱データを同時に比較分析することができます。養蜂家が一目で巣箱の状態を把握できる仕組みです。


The datasets used for this analysis are historical records and not real-time data. Four key parameters are tracked for each hive:
1. **Flow Data**: This dataset records the number of bee arrivals and departures from each hive. Positive values indicate arrivals, while negative values represent departures.
2. **Humidity Data**: This captures the humidity levels inside the hive over time, expressed as a percentage.
3. **Temperature Data**: This tracks the internal temperature of the hive, measured in degrees Celsius.
4. **Weight Data**: This dataset logs the hive's weight over time, allowing insights into the hive's productivity and honey storage.

It is important to note that for the Würzburg hive, there is missing data from May 2018 to October 2018 due to a station malfunction.

The interactive visualizations aim to provide insights into bee behavior and hive health by exploring:
- How hive activity (departures and arrivals) fluctuates over time.
- The correlation between hive weight and environmental factors (humidity, temperature).
- Seasonal patterns in hive activity and productivity.

This analysis helps answer questions like: 
- Are there significant changes in hive activity during different seasons?
- How do environmental factors (temperature, humidity) impact hive productivity?

## Core Technologies

I chose classic MERN for the core technologies. 

### MongoDB
Initially, I considered using InfluxDB in combination with DataFrame.js for data processing, since the data is a bunch of numerical dataset. However, the limitations of the free-tier of InfluxDB—specifically, the restriction that data must be less than 3 months old—made it unsuitable for my needs. This constraint prevented me from utilizing InfluxDB for historical data analysis, leading me to opt for MongoDB aggregation as a more practical and effective solution.

### Node.js and Express
Node.js, with its non-blocking I/O model, was selected for the backend server to handle multiple simultaneous requests efficiently. Express.js, a minimal and flexible Node.js web application framework, was used to build the RESTful API endpoints. 

### React
React was chosen for the frontend due to its component-based architecture and efficient update mechanisms. It enables the creation of a dynamic and responsive user interface, which is crucial for visualizing time-series data interactively. 

### Plotly
Plotly.js was utilized for data visualization, leveraging its powerful capabilities to create interactive and aesthetically pleasing charts. Plotly’s rich feature set, including zooming, panning, and tooltips, enhances user interaction with the data.

## How to Use

### Controls and Interactions

1. **Date Range Selector**:
   - Use the date range picker to select the time period you want to analyze.

2. **Data Tabs**:
   - The header has links for different types of data:
     - **Temperature Data**: Displays the average temperature of the beehive in °C.
     - **Humidity Data**: Shows the humidity levels over time.
     - **Weight Data**: Represents the weight changes of the beehive. When the weight approaches 0, it may indicate that a harvest has occurred.
     - **Flow Data**: Visualizes the number of arrivals and departures.

3. **Graphs**:
   - **Interactive Charts**: Hover over data points to see detailed information such as exact values and timestamps.
   - **Zoom and Pan**: Use your mouse or touch gestures to zoom in and out or pan across the charts to view specific periods in detail.
