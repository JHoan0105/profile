export const donutChartOptionsGeneral = {
  series: [75, 25],
  labels: ['Used (MB)', 'Remaining (MB)'],
  chart: {
    height: 500,
    width: '100%',
  },
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: true, // Enable data labels if needed
    style: {
      colors: ['#000', '#000'], // Change label text color here
    },
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: true,
          style: {
            colors: ['#000', '#000'], // Change donut segment label color here
          },
        },
      },
    },
  },
  fill: {
    type: 'solid',
    colors: ["var(--chakra-colors-brand-500)", '#959596', '#E1E9F8'],
  },
  colors: ["var(--chakra-colors-brand-500)", '#959596', '#E1E9F8'],
  tooltip: {
    enabled: true,
    theme: 'dark',
    style: {
      fontSize: '12px', // You can adjust the font size here
      color: '#000', // Change this to your desired text color
    },
  },
};
export const donutChartOptionsForRemaining = {
  series: [100, -20],
  labels: ['Used (MB)', 'Overage (MB)'],
  chart: {
    height: 500,
    width: '100%',
  },
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: true, // Enable data labels if needed
    style: {
      colors: ['#000', '#000'], // Change label text color here
    },
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: true,
          style: {
            colors: ['#000', '#000'], // Change donut segment label color here
          },
        },
      },
    },
  },
  fill: {
    type: 'solid',
    colors: ["var(--chakra-colors-horizonRed-500)", '#959596', '#E1E9F8'],
  },
  colors: ["var(--chakra-colors-horizonRed-500)", '#959596', '#E1E9F8'],
  tooltip: {
    enabled: true,
    theme: 'dark',
    style: {
      fontSize: '12px', // You can adjust the font size here
      color: '#000', // Change this to your desired text color
    },
  },
};

export const donutChartOptionsGeneralBytes = {
  series: [75, 25],
  labels: ['Used (Bytes)', 'Remaining (Bytes)'],
  chart: {
    height: 500,
    width: '100%',
  },
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: true, // Enable data labels if needed
    style: {
      colors: ['#000', '#000'], // Change label text color here
    },
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: true,
          style: {
            colors: ['#000', '#000'], // Change donut segment label color here
          },
        },
      },
    },
  },
  fill: {
    type: 'solid',
    colors: ["var(--chakra-colors-brand-500)", '#959596', '#E1E9F8'],
  },
  colors: ["var(--chakra-colors-brand-500)", '#959596', '#E1E9F8'],
  tooltip: {
    enabled: true,
    theme: 'dark',
    style: {
      fontSize: '12px', // You can adjust the font size here
      color: '#000', // Change this to your desired text color
    },
  },
};
export const donutChartOptionsForRemainingBytes = {
  series: [100, -20],
  labels: ['Used (Bytes)', 'Overage (Bytes)'],
  chart: {
    height: 500,
    width: '100%',
  },
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: true, // Enable data labels if needed
    style: {
      colors: ['#000', '#000'], // Change label text color here
    },
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: true,
          style: {
            colors: ['#000', '#000'], // Change donut segment label color here
          },
        },
      },
    },
  },
  fill: {
    type: 'solid',
    colors: ["var(--chakra-colors-horizonRed-500)", '#959596', '#E1E9F8'],
  },
  colors: ["var(--chakra-colors-horizonRed-500)", '#959596', '#E1E9F8'],
  tooltip: {
    enabled: true,
    theme: 'dark',
    style: {
      fontSize: '12px', // You can adjust the font size here
      color: '#000', // Change this to your desired text color
    },
  },
};

export const donutChartDataGeneral = [75, 25];