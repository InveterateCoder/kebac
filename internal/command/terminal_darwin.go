//go:build darwin

package command

import (
	"fmt"
	"os/exec"
	"strings"
)

func setCmdSysProcAttr(cmd *exec.Cmd) {}

func (c *command) OpenTerminal(args ...string) error {
	bin := c.cmd
	if c.info.KubectlPath != "" {
		bin = c.info.KubectlPath
	}
	cmdLine := joinShellArgs(append([]string{bin}, args...)) + "; exec $SHELL"
	script := fmt.Sprintf(`tell application "Terminal" to do script "%s"`, escapeAppleScript(cmdLine))
	return exec.Command("osascript", "-e", script).Start()
}

func joinShellArgs(args []string) string {
	quoted := make([]string, 0, len(args))
	for _, arg := range args {
		quoted = append(quoted, quoteShellArg(arg))
	}
	return strings.Join(quoted, " ")
}

func quoteShellArg(value string) string {
	if value == "" {
		return "''"
	}
	if !strings.ContainsAny(value, " \t\n\"'`$\\") {
		return value
	}
	return "'" + strings.ReplaceAll(value, "'", `'"'"'`) + "'"
}

func escapeAppleScript(value string) string {
	value = strings.ReplaceAll(value, `\`, `\\`)
	value = strings.ReplaceAll(value, `"`, `\"`)
	return value
}
