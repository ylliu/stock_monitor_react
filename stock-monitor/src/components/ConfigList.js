import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // 引入 Bootstrap 样式

const ConfigList = ({ board, onConfigSelected }) => {
  const [configs, setConfigs] = useState([]);
  const [serverIp, setServerIp] = useState(null);

  useEffect(() => {
      fetch('./server_ip.json')
        .then(response => response.json())
        .then(data => {
          setServerIp(data.server_ip);
          console.log(data.server_ip); // 确保正确获取到 serverIp
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }, []);
  // 获取配置列表
  const fetchConfigs = () => {
    axios
      .get(`http://${serverIp}:5000/config/list${board ? `?board=${board}` : ""}`)
      .then((response) => {
        setConfigs(response.data);
      })
      .catch((error) => console.error("Error fetching config list:", error));
  };

  useEffect(() => {
    fetchConfigs();
  }, [board,serverIp]);

  // 删除配置项
  const deleteConfig = (board, id) => {
    if (window.confirm(`确定要删除 ID 为 ${id} 的配置吗？`)) {
      axios
        .delete(`http://${serverIp}:5000/config/${board}/${id}`)
        .then(() => {
          fetchConfigs(); // 删除后重新获取配置列表
        })
        .catch((error) => console.error("Error deleting config:", error));
    }
  };

  const applyConfig = (board, id) => {
    axios
      .post(`http://${serverIp}:5000/config/apply/${board}/${id}`)
      .then(() => {
        setConfigs(
          configs.map((config) => ({
            ...config,
            is_applied: config.id === id,
          }))
        );

        // Fetch the configuration details for the selected config
        axios
          .get(`http://${serverIp}:5000/config/${board}/${id}`)
          .then((response) => {
            onConfigSelected(response.data); // Pass selected config to the parent component
          })
          .catch((error) => console.error("Error fetching config:", error));
      })
      .catch((error) => console.error("Error applying config:", error));
  };

  // 新增配置
  const addConfig = (board) => {
    const newConfigData = {
      first_day_vol_ratio: 1.5,
      free_float_value_range_min: 10,
      free_float_value_range_max: 500,
      circulation_value_range_min: 50,
      circulation_value_range_max: 800,
      second_candle_new_high_days: 10,
      ma10_ratio: 1.004,
      days_to_ma10: 20,
      ma5_trigger: 1,
      ma10_trigger: 1,
      two_positive_pct_avg: 11,
      min_positive_days: 3,
      is_margin_stock: true,
      max_volume_high_days:20,
      five_days_max_up_pct:10,
      ten_days_max_up_pct:20,
      is_second_day_price_up:true,
      config_name:'方案XX'
    };

    axios
      .post(`http://${serverIp}:5000/config/${board}/999999`, newConfigData)
      .then((response) => {
        fetchConfigs(); // 新增后重新获取配置列表
      })
      .catch((error) => console.error("Error adding config:", error));
  };

  // 过滤出符合选定板块的配置
  const filteredConfigs = board
    ? configs.filter((config) => config.board === board)
    : configs;

  // 根据 board 类型动态改变按钮的名称
  const getAddConfigButtonText = () => {
    switch (board) {
      case "main":
        return "新增主板配置";
      case "chiNext":
        return "新增创业板配置";
      case "sciNext":
        return "新增科创板配置";
      default:
        return "新增配置";
    }
  };

  return (
    <div className="container mt-4">
      <h5 className="mb-4">
        {board
          ? board === "main"
            ? "主板配置"
            : board === "chiNext"
            ? "创业板配置"
            : "科创板配置"
          : "全部配置列表"}
      </h5>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>板块</th>
            <th className="text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredConfigs.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center p-4">
                暂无配置数据
              </td>
            </tr>
          ) : (
            filteredConfigs.map((config) => (
              <tr key={config.id} className={config.is_applied ? "table-success" : ""}>
                <td>{config.id}</td>
                <td>{config.config_name}</td>
                <td>{config.board === "main" ? "主板" : config.board === "chiNext" ? "创业板" : "科创板"}</td>
                <td className="text-center">
                  <button
                    className={`btn me-2 ${config.is_applied ? "btn-secondary" : "btn-success"}`}
                    onClick={() => applyConfig(config.board, config.id)}
                    disabled={config.is_applied} // 禁用已选中的方案
                  >
                    {config.is_applied ? "已应用" : "选择"}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteConfig(config.board, config.id)}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 新增配置按钮 */}
      <div className="text-letf mt-4">
        <button className="btn btn-primary" onClick={() => addConfig(board)}>
          {getAddConfigButtonText()}
        </button>
      </div>
    </div>
  );
};

export default ConfigList;
