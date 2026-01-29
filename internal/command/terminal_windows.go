//go:build windows

package command

import (
	"fmt"
	"os/exec"
	"strings"
	"syscall"
)

func setCmdSysProcAttr(cmd *exec.Cmd) {
	cmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow: true,
	}
}

func (c *command) OpenTerminal(args ...string) error {
	bin := c.cmd
	if c.info.KubectlPath != "" {
		bin = c.info.KubectlPath
	}

	shell := "pwsh"
	if _, err := exec.LookPath(shell); err != nil {
		shell = "powershell.exe"
	}

	cmdLine := joinPowerShellArgs(append([]string{bin}, args...))
	command := fmt.Sprintf(
		"Start-Process -FilePath %s -ArgumentList %s",
		quotePowerShellLiteral(shell),
		formatPowerShellArray([]string{"-NoExit", "-Command", cmdLine}),
	)
	cmd := exec.Command(shell, "-NoProfile", "-Command", command)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow: true,
	}
	return cmd.Start()
}

func joinPowerShellArgs(args []string) string {
	quoted := make([]string, 0, len(args))
	for _, arg := range args {
		quoted = append(quoted, quotePowerShellLiteral(arg))
	}
	return "& " + strings.Join(quoted, " ")
}

func formatPowerShellArray(args []string) string {
	quoted := make([]string, 0, len(args))
	for _, arg := range args {
		quoted = append(quoted, quotePowerShellLiteral(arg))
	}
	return "@(" + strings.Join(quoted, ",") + ")"
}

func quotePowerShellLiteral(value string) string {
	return "'" + strings.ReplaceAll(value, "'", "''") + "'"
}
