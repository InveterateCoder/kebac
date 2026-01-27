//go:build !windows
// +build !windows

package command

import "os/exec"

func setCmdSysProcAttr(cmd *exec.Cmd) {}
