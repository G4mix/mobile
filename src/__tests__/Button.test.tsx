import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";
import { Button } from "../components/Button"; 

describe("Button component", () => {
  it("renderiza corretamente com o texto filho", () => {
    const { getByText } = render(
      <Button>
        <Text>Enviar</Text>
      </Button>
    );

    expect(getByText("Enviar")).toBeTruthy();
  });

  it("executa a função onPress quando clicado", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button onPress={onPressMock}>
        <Text>Pressionar</Text>
      </Button>
    );

    fireEvent.press(getByText("Pressionar"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("aplica o estilo de desabilitado quando `disabled` é true", () => {
    const { getByTestId } = render(
        <Button disabled>
        <Text>Desabilitado</Text>
        </Button>
    );

    const button = getByTestId("custom-button");

    expect(button.props.style).toEqual(
        expect.objectContaining({ opacity: 0.7 })
    );
  });
});
