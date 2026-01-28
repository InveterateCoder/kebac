//go:build windows
// +build windows

package command

import (
	"os/exec"
	"syscall"

	"golang.org/x/sys/windows"
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

	cmd := exec.Command(bin, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		CreationFlags: windows.CREATE_NEW_CONSOLE,
	}
	return cmd.Start()
}
