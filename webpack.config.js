const path = require('path') //处理绝对路径
const webpack = require('webpack')
    //自动生成html文件
const HtmlWebpackPlugin = require('html-webpack-plugin')
    //清理dist文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
    //引入分离文件,主要是为了抽离 css 样式,防止将样式打包在 js 中引起页面样式加载错乱的现象
    //const ExtractTextPlugin = require('extract-text-webpack-plugin')
    //消除冗余css
const PurifyCssWebpack = require('purifycss-webpack')
    //分离css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
    //压缩css文件  webpack内置的压缩插件，仅仅支持JS文件的压缩
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require("terser-webpack-plugin");
// 引入glob模块,用于扫描全部html文件中所引用的css
const glob = require('glob')
    //测试webpack构建各阶段花费时间
const speedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new speedMeasurePlugin()
    //分析包内容
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const devMode = process.env.NODE_ENV !== "production";

let webpackConfig = {
  //   mode: "development", //production
  entry: path.join(__dirname, "/index.js"), //入口文件
  output: {
    path: path.join(__dirname, "/dist"), //打包后文件存放的位置
    // filename: 'bundle.js', //打包后输出的文件名称
    filename: "[name].[hash:8].js",
  },
  //配置本地服务器
  devServer: {
    contentBase: "./dist", //本地服务器所加载的文件的目录
    port: "8080", //端口号
    inline: true, //文件修改后实时刷新
    historyApiFallback: false, //不跳转,
    hot: true, //热更新
  },
  module: {
    rules: [
      {
        test: /\.css$/, //正则匹配以.css结尾的文件
        use: [
          //   { loader: MiniCssExtractPlugin.loader }, // 通过link标签引入
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "style-loader", //通过style标签引入
          "css-loader",
          "postcss-loader", //使用postcss-loader
        ],
        exclude: /node_modules/,
        // use: ExtractTextPlugin.extract({
        //     //相当于回滚，给postcss-loader和css-loader处理过的css最终再经过style-loader处理
        //     fallback: 'style-loader',
        //     use: ['css-loader', 'postcss-loader']
        // })
      },
      {
        test: /\.less/,
        use: [{ loader: MiniCssExtractPlugin.loader }, "css-loader", "less-loader"],
        exclude: /node_modules/,
        //include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.(scss|sass)$/, //正则匹配.sass或.scss结尾的文件
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        // loader:'babel-loader',
        use: ["thread-loader", "babel-loader"],
        // exclude: /node_modules/,
        include: path.resolve("src"),
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        // loader: 'url-loader',
        // options: {
        //     limit: 10000,
        //     name: utils.assetsPath('img/[name].[hash:7].[ext]')
        // }
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "/src"),
    },
  },
  plugins: [
    //开启BundleAnalyzerPlugin
    //new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
    new CleanWebpackPlugin(),
    //热更新
    new webpack.HotModuleReplacementPlugin(),
    // 引入css模块按需加载插件
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    //new ExtractTextPlugin('css/idnex.css'), //将css分离到/dist下的css文件夹中的index.css
    new PurifyCssWebpack({
      paths: glob.sync(path.join(__dirname, "*.html")), //同步扫描所有html文件中引入的css
    }),
  ],
  optimization: {
    concatenateModules: false,
    minimize: true,
    // 开启minimizer会导致JS不会被压缩，表示开发者在自定义压缩插件，内部的js压缩器会被覆盖
    minimizer: [
      new TerserWebpackPlugin(),
      // new OptimizeCssAssetsWebpackPlugin(),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        // 提取所有的css到一个文件中
        styles: {
          name: "styles",
          type: "css/mini-extract",
          // For webpack@4
          // test: /\.css$/,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
};

module.exports = smp.wrap(webpackConfig)