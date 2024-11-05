import { useEffect } from 'react'
import { init, dispose } from 'klinecharts'

const  CandlestickChart =(K_data) => {
  useEffect(() => {
    console.log("hello")
    const chart = init('k-line-chart')
    function setBarUpColor (upColor) {
      chart.setStyles({
        candle:{
          bar:{upColor},
        }
      })
    }
    function setBarUpBorderColor (upBorderColor) {
      chart.setStyles({
        candle:{
          bar:{upBorderColor},
        }
      })
    }
    function setBarUpWickColor (upWickColor) {
      chart.setStyles({
        candle:{
          bar:{upWickColor}
        }
      })
    }
    setBarUpColor( '#F92855')
    setBarUpBorderColor( '#F92855')
    setBarUpWickColor( '#F92855')

    function setBarDownColor (downColor) {
      chart.setStyles({
        candle:{
          bar:{downColor},
        }
      })
    }
    function setBarDownBorderColor (downBorderColor) {
      chart.setStyles({
        candle:{
          bar:{downBorderColor},
        }
      })
    }
    function setBarDownWickColor (downWickColor) {
      chart.setStyles({
        candle:{
          bar:{downWickColor}
        }
      })
    }
    setBarDownColor( '#2DC08E')
    setBarDownBorderColor( '#2DC08E')
    setBarDownWickColor( '#2DC08E')
  
  
    chart.createIndicator('MA', false, { id: 'candle_pane' })
    chart.createIndicator('VOL')
    chart.applyNewData(K_data.data)          
    return () => {
      dispose('k-line-chart')
    }
  }, [])

  return <div id="k-line-chart" style={{ width: 600, height: 600 }}/>
};

export default CandlestickChart;


