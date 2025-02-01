
export const barChartDataConsumption = [
  {
    name: 'Usage',
    data: [10, 10, 10, 10, 10, 8, 6, 10, 10,10,10,5],
    color: '#FF8000', // Orange
  }
];

export const barChartOptionsConsumption = {
  chart: {
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: '12px',
      fontFamily: undefined,
    },
    onDatasetHover: {
      style: {
        fontSize: '12px',
        fontFamily: undefined,
      },
    },
    theme: 'dark',
  },
  xaxis: {
    categories: ['2023/11', '2023/12', '2024/01', '2024/02', '2024/03', '2024/04', '2024/05', '2024/06', '2024/07'],
    show: false,
    labels: {
      show: true,
      style: {
        colors: '#FFFFFF',
        fontSize: '14px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: 'black',
    labels: {
      show: false,
      style: {
        colors: '#A3AED0',
        fontSize: '14px',
        fontWeight: '500',
      },
    },
  },
  grid: {
    borderColor: 'rgba(163, 174, 208, 0.3)',
    show: true,
    yaxis: {
      lines: {
        show: false,
        opacity: 0.5,
      },
    },
    row: {
      opacity: 0.5,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: 'solid',
    colors: ["var(--chakra-colors-brand-500)", '#6AD2FF', '#E1E9F8'],
  },
  colors: ["var(--chakra-colors-brand-500)", '#6AD2FF', '#E1E9F8'],
  legend: {
    show: true,
    labels: {
      colors: '#A3AED0',
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: '30px',
    },
  },
};
export const barChartOptionsConsumptionLight = {
  chart: {
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: '12px',
      fontFamily: undefined,
    },
    onDatasetHover: {
      style: {
        fontSize: '12px',
        fontFamily: undefined,
      },
    },
    theme: 'light',
  },
  xaxis: {
    categories: ['2023/11', '2023/12', '2024/01', '2024/02', '2024/03', '2024/04', '2024/05', '2024/06', '2024/07'],
    show: false,
    labels: {
      show: true,
      style: {
        colors: '#000000',
        fontSize: '14px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: 'black',
    labels: {
      show: false,
      style: {
        colors: '#A3AED0',
        fontSize: '14px',
        fontWeight: '500',
      },
    },
  },
  grid: {
    borderColor: 'rgba(163, 174, 208, 0.3)',
    show: true,
    yaxis: {
      lines: {
        show: false,
        opacity: 0.5,
      },
    },
    row: {
      opacity: 0.5,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: 'solid',
    colors: ["var(--chakra-colors-brand-500)", '#6AD2FF', '#E1E9F8'],
  },
  colors: ["var(--chakra-colors-brand-500)", '#6AD2FF', '#E1E9F8'],
  legend: {
    show: true,
    labels: {
      colors: '#A3AED0',
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: '30px',
    },
  },
};

export const barChartOptionsConsumption2 = {
  chart: {
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: '12px',
      fontFamily: undefined,
    },
    onDatasetHover: {
      style: {
        fontSize: '12px',
        fontFamily: undefined,
      },
    },
    theme: 'dark',
  },
  xaxis: {
    categories: ['2023/11', '2023/12', '2024/01', '2024/02', '2024/03', '2024/04', '2024/05', '2024/06', '2024/07'],
    show: false,
    labels: {
      show: true,
      style: {
        colors: '#A3AED0',
        fontSize: '14px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: 'black',
    labels: {
      show: false,
      style: {
        colors: '#A3AED0',
        fontSize: '14px',
        fontWeight: '500',
      },
    },
  },

  grid: {
    borderColor: 'rgba(163, 174, 208, 0.3)',
    show: true,
    yaxis: {
      lines: {
        show: false,
        opacity: 0.5,
      },
    },
    row: {
      opacity: 0.5,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: 'solid',
    colors: ['#00FF00', '#FFFF00', '#FF0000'],
  },
  legend: {
    show: true,
  },
  colors: ['#00FF00', '#FFFF00', '#FF0000'],
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: '30px',
    },
  },
};
