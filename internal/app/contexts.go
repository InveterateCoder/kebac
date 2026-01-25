package app

import "github.com/InveterateCoder/kebac/internal/command"

func (a *App) ListContexts() ([]string, error) {
	return command.Cmd.ListContexts()
}

func (a *App) ListNamespaces(context string) ([]string, error) {
	return command.Cmd.ListNamespaces(context)
}
