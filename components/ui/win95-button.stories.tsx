// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";
import { Win95Button } from "./win95-button";

const meta: Meta<typeof Win95Button> = {
    title: "UI/Win95Button",
    component: Win95Button,
    tags: ["autodocs"],
    argTypes: {
        active: { control: "boolean" },
        disabled: { control: "boolean" },
    },
};

export default meta;
type Story = StoryObj<typeof Win95Button>;

export const Default: Story = {
    args: {
        children: "OK",
    },
};

export const Active: Story = {
    args: {
        children: "Cancel",
        active: true,
    },
};

export const Disabled: Story = {
    args: {
        children: "Apply",
        disabled: true,
    },
};

export const LongText: Story = {
    args: {
        children: "Click me to execute program.exe",
    },
};
