package app

import (
	"fmt"
	"strings"

	"github.com/InveterateCoder/kebac/internal/command"
)

func (a *App) OpenPortForward(req PortForwardRequest) error {
	if strings.TrimSpace(req.Context) == "" {
		return fmt.Errorf("context is required")
	}
	if strings.TrimSpace(req.Namespace) == "" {
		return fmt.Errorf("namespace is required")
	}
	if strings.TrimSpace(req.Pod) == "" {
		return fmt.Errorf("pod is required")
	}
	if req.LocalPort <= 0 || req.RemotePort <= 0 {
		return fmt.Errorf("local and remote ports must be greater than zero")
	}

	args := []string{
		"port-forward",
		"pod/" + req.Pod,
		fmt.Sprintf("%d:%d", req.LocalPort, req.RemotePort),
		"--context",
		req.Context,
		"--namespace",
		req.Namespace,
	}
	return command.Cmd.OpenTerminal(args...)
}

func (a *App) OpenExec(req ExecRequest) error {
	if strings.TrimSpace(req.Context) == "" {
		return fmt.Errorf("context is required")
	}
	if strings.TrimSpace(req.Namespace) == "" {
		return fmt.Errorf("namespace is required")
	}
	if strings.TrimSpace(req.Pod) == "" {
		return fmt.Errorf("pod is required")
	}

	cmd := strings.TrimSpace(req.Command)
	if cmd == "" {
		cmd = "sh"
	}

	args := []string{
		"exec",
		"-it",
		"pod/" + req.Pod,
		"--context",
		req.Context,
		"--namespace",
		req.Namespace,
	}
	if strings.TrimSpace(req.Container) != "" {
		args = append(args, "-c", req.Container)
	}
	args = append(args, "--")
	args = append(args, strings.Fields(cmd)...)

	return command.Cmd.OpenTerminal(args...)
}
