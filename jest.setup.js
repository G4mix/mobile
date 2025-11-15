try {
  require("react-native-gesture-handler/jestSetup");
} catch (e) {
}

jest.mock("react-native-reanimated", () => {
  const View = require("react-native").View;
  return {
    default: {
      Value: jest.fn(() => ({ setValue: jest.fn() })),
      event: jest.fn(),
      add: jest.fn(),
      eq: jest.fn(),
      set: jest.fn(),
      cond: jest.fn(),
      interpolate: jest.fn(),
      View: View,
      Extrapolate: { EXTEND: "extend" },
      Transition: {
        Together: "Together",
        OutIn: "OutIn",
        InOut: "InOut",
      },
    },
  };
});

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => "/"),
  Link: ({ children, href, ...props }) => {
    const React = require("react");
    const { TouchableOpacity, Text } = require("react-native");
    return React.createElement(
      TouchableOpacity,
      { ...props, testID: `link-${href}` },
      children
    );
  },
}));

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("@/components/Icon", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Icon: ({ name, size, color, style, ...props }) =>
      React.createElement(View, { 
        ...props, 
        style,
        testID: `icon-${name}` 
      }),
  };
});

jest.mock("@/components/SpinLoading", () => {
  const React = require("react");
  const { Text, View } = require("react-native");
  return {
    SpinLoading: ({ message = "Carregando..." }) =>
      React.createElement(View, { testID: "spin-loading" },
        React.createElement(Text, {}, message)
      ),
  };
});

const originalError = console.error;

global.console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: An update to') ||
     args[0].includes('not wrapped in act'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};