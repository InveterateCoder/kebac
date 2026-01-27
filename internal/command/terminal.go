package command

import (
	"fmt"
	"os/exec"
	"runtime"
	"strings"
)

func (c *command) OpenTerminal(args ...string) error {
	bin := c.cmd
	if c.info.KubectlPath != "" {
		bin = c.info.KubectlPath
	}
	switch runtime.GOOS {
	case "windows":
		return openTerminalWindows(bin, args)
	case "darwin":
		return openTerminalDarwin(bin, args)
	default:
		return openTerminalLinux(bin, args)
	}
}

func openTerminalWindows(bin string, args []string) error {
	cmdLine := joinCmdArgs(append([]string{bin}, args...))
	return exec.Command("cmd", "/C", "start", "", "cmd", "/K", cmdLine).Start()
}

func openTerminalDarwin(bin string, args []string) error {
	cmdLine := joinShellArgs(append([]string{bin}, args...))
	script := fmt.Sprintf(`tell application "Terminal" to do script "%s"`, escapeAppleScript(cmdLine))
	return exec.Command("osascript", "-e", script).Start()
}

func openTerminalLinux(bin string, args []string) error {
	candidates := []terminalCandidate{
		{name: "x-terminal-emulator", flag: "-e"},
		{name: "gnome-terminal", flag: "--"},
		{name: "konsole", flag: "-e"},
		{name: "xfce4-terminal", flag: "-e"},
		{name: "xterm", flag: "-e"},
		{name: "alacritty", flag: "-e"},
		{name: "kitty", flag: "-e"},
	}

	for _, candidate := range candidates {
		path, err := exec.LookPath(candidate.name)
		if err != nil {
			continue
		}
		cmdArgs := append([]string{candidate.flag, bin}, args...)
		return exec.Command(path, cmdArgs...).Start()
	}

	return fmt.Errorf("no supported terminal emulator found")
}

type terminalCandidate struct {
	name string
	flag string
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

func joinCmdArgs(args []string) string {
	quoted := make([]string, 0, len(args))
	for _, arg := range args {
		quoted = append(quoted, quoteCmdArg(arg))
	}
	return strings.Join(quoted, " ")
}

func quoteCmdArg(value string) string {
	if value == "" {
		return `""`
	}
	if !strings.ContainsAny(value, " \t\"") {
		return value
	}
	return `"` + strings.ReplaceAll(value, `"`, `""`) + `"`
}

func escapeAppleScript(value string) string {
	value = strings.ReplaceAll(value, `\`, `\\`)
	value = strings.ReplaceAll(value, `"`, `\"`)
	return value
}
