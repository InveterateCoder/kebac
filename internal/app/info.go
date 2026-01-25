package app

import "github.com/InveterateCoder/kebac/internal/command"

func (a *App) GetKubectlInfo() command.CommandInfo {
	return command.Cmd.GetInfo()
}
